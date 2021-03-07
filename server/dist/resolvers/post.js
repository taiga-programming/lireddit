"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostResolver = void 0;
const tslib_1 = require("tslib");
const type_graphql_1 = require("type-graphql");
const Post_1 = require("../entities/Post");
let PostResolver = class PostResolver {
    async posts() {
        return Post_1.Post.find();
    }
    post(id) {
        return Post_1.Post.findOne(id);
    }
    async createPost(title) {
        return Post_1.Post.create({ title }).save();
    }
    async updatePost(id, title) {
        const post = await Post_1.Post.findOne(id);
        if (!post) {
            return null;
        }
        if (typeof title !== "undefined") {
            await Post_1.Post.update({ id }, { title });
        }
        return post;
    }
    async deletePost(id) {
        await Post_1.Post.delete(id);
        return true;
    }
};
tslib_1.__decorate([
    type_graphql_1.Query(() => [Post_1.Post]),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], PostResolver.prototype, "posts", null);
tslib_1.__decorate([
    type_graphql_1.Query(() => Post_1.Post, { nullable: true }),
    tslib_1.__param(0, type_graphql_1.Arg("id")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], PostResolver.prototype, "post", null);
tslib_1.__decorate([
    type_graphql_1.Mutation(() => Post_1.Post),
    tslib_1.__param(0, type_graphql_1.Arg("title")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
tslib_1.__decorate([
    type_graphql_1.Mutation(() => Post_1.Post, { nullable: true }),
    tslib_1.__param(0, type_graphql_1.Arg("id")),
    tslib_1.__param(1, type_graphql_1.Arg("title", () => String, { nullable: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
tslib_1.__decorate([
    type_graphql_1.Mutation(() => Boolean),
    tslib_1.__param(0, type_graphql_1.Arg("id")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
PostResolver = tslib_1.__decorate([
    type_graphql_1.Resolver()
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=post.js.map