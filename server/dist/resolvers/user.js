"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const tslib_1 = require("tslib");
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
const argon2_1 = tslib_1.__importDefault(require("argon2"));
const constants_1 = require("../constants");
const UsernamePasswordInput_1 = require("./UsernamePasswordInput");
const validateRegister_1 = require("../utils/validateRegister");
const sendEmail_1 = require("../utils/sendEmail");
const uuid_1 = require("uuid");
const typeorm_1 = require("typeorm");
let FieldError = class FieldError {
};
tslib_1.__decorate([
    type_graphql_1.Field(),
    tslib_1.__metadata("design:type", Object)
], FieldError.prototype, "field", void 0);
tslib_1.__decorate([
    type_graphql_1.Field(),
    tslib_1.__metadata("design:type", Object)
], FieldError.prototype, "message", void 0);
FieldError = tslib_1.__decorate([
    type_graphql_1.ObjectType()
], FieldError);
let UserResponse = class UserResponse {
};
tslib_1.__decorate([
    type_graphql_1.Field(() => [FieldError], { nullable: true }),
    tslib_1.__metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
tslib_1.__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: true }),
    tslib_1.__metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = tslib_1.__decorate([
    type_graphql_1.ObjectType()
], UserResponse);
let UserResolver = class UserResolver {
    async changePassword(token, newPassword, { redis, req }) {
        if (newPassword.length <= 2) {
            return {
                errors: [
                    {
                        field: "newPassword",
                        message: "length must be greater than 2",
                    },
                ],
            };
        }
        const key = constants_1.FORGET_PASSWORD_PREFIX + token;
        const userId = await redis.get(key);
        if (!userId) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "token expired",
                    },
                ],
            };
        }
        const userIdNum = parseInt(userId);
        const user = await User_1.User.findOne(userIdNum);
        if (!user) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "user no longer exists",
                    },
                ],
            };
        }
        await User_1.User.update({ id: userIdNum }, {
            password: await argon2_1.default.hash(newPassword),
        });
        await redis.del(key);
        req.session.userId = user.id;
        return { user };
    }
    async forgotPassword(email, { redis }) {
        const user = await User_1.User.findOne({ where: { email } });
        if (!user) {
            return true;
        }
        const token = uuid_1.v4();
        await redis.set(constants_1.FORGET_PASSWORD_PREFIX + token, user.id, "ex", 1000 * 60 * 60 * 24 * 3);
        await sendEmail_1.sendEmail(email, `<a href="http://localhost:3000/change-password/${token}">reset password</a>`);
        return true;
    }
    me({ req }) {
        if (!req.session.userId) {
            return null;
        }
        return User_1.User.findOne(req.session.userId);
    }
    async register(options, { req }) {
        const errors = validateRegister_1.validateRegister(options);
        if (errors) {
            return { errors };
        }
        const hashedPassword = await argon2_1.default.hash(options.password);
        let user;
        try {
            const result = await typeorm_1.getConnection()
                .createQueryBuilder()
                .insert()
                .into(User_1.User)
                .values({
                username: options.username,
                email: options.email,
                password: hashedPassword,
            })
                .returning("*")
                .execute();
            user = result.raw[0];
        }
        catch (err) {
            if (err.code === "23505") {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "username already taken",
                        },
                    ],
                };
            }
        }
        req.session.userId = user.id;
        return { user };
    }
    async login(usernameOrEmail, password, { req }) {
        const user = await User_1.User.findOne(usernameOrEmail.includes("@")
            ? { where: { email: usernameOrEmail } }
            : { where: { username: usernameOrEmail } });
        if (!user) {
            return {
                errors: [
                    {
                        field: "usernameOrEmail",
                        message: "that username doesn't exist",
                    },
                ],
            };
        }
        const valid = await argon2_1.default.verify(user.password, password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "incorrect password",
                    },
                ],
            };
        }
        req.session.userId = user.id;
        return {
            user,
        };
    }
    logout({ req, res }) {
        return new Promise((resolve) => req.session.destroy((err) => {
            res.clearCookie(constants_1.COOKIE_NAME);
            if (err) {
                console.log(err);
                resolve(false);
                return;
            }
            resolve(true);
        }));
    }
};
tslib_1.__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    tslib_1.__param(0, type_graphql_1.Arg("token")),
    tslib_1.__param(1, type_graphql_1.Arg("newPassword")),
    tslib_1.__param(2, type_graphql_1.Ctx()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserResolver.prototype, "changePassword", null);
tslib_1.__decorate([
    type_graphql_1.Mutation(() => Boolean),
    tslib_1.__param(0, type_graphql_1.Arg("email")),
    tslib_1.__param(1, type_graphql_1.Ctx()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserResolver.prototype, "forgotPassword", null);
tslib_1.__decorate([
    type_graphql_1.Query(() => User_1.User, { nullable: true }),
    tslib_1.__param(0, type_graphql_1.Ctx()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], UserResolver.prototype, "me", null);
tslib_1.__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    tslib_1.__param(0, type_graphql_1.Arg("options")),
    tslib_1.__param(1, type_graphql_1.Ctx()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [UsernamePasswordInput_1.UsernamePasswordInput, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
tslib_1.__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    tslib_1.__param(0, type_graphql_1.Arg("usernameOrEmail")),
    tslib_1.__param(1, type_graphql_1.Arg("password")),
    tslib_1.__param(2, type_graphql_1.Ctx()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
tslib_1.__decorate([
    type_graphql_1.Mutation(() => Boolean),
    tslib_1.__param(0, type_graphql_1.Ctx()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], UserResolver.prototype, "logout", null);
UserResolver = tslib_1.__decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map