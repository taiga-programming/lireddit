"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelloResolver = void 0;
const tslib_1 = require("tslib");
const type_graphql_1 = require("type-graphql");
let HelloResolver = class HelloResolver {
    hello() {
        return "bye";
    }
};
tslib_1.__decorate([
    type_graphql_1.Query(() => String),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], HelloResolver.prototype, "hello", null);
HelloResolver = tslib_1.__decorate([
    type_graphql_1.Resolver()
], HelloResolver);
exports.HelloResolver = HelloResolver;
//# sourceMappingURL=hello.js.map