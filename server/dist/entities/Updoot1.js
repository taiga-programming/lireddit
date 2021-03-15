"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Updoot1 = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Post_1 = require("./Post");
let Updoot1 = class Updoot1 extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.Column({ type: "int" }),
    __metadata("design:type", Number)
], Updoot1.prototype, "value", void 0);
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Updoot1.prototype, "userId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, (user) => user.updoots),
    __metadata("design:type", User_1.User)
], Updoot1.prototype, "user", void 0);
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Updoot1.prototype, "postId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Post_1.Post, (post) => post.updoots),
    __metadata("design:type", Post_1.Post)
], Updoot1.prototype, "post", void 0);
Updoot1 = __decorate([
    typeorm_1.Entity()
], Updoot1);
exports.Updoot1 = Updoot1;
//# sourceMappingURL=Updoot1.js.map