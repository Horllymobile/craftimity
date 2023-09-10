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
exports.CountryEntity = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let CountryEntity = class CountryEntity extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BIGINT, primaryKey: true }),
    __metadata("design:type", Number)
], CountryEntity.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Length)({ max: 256 }),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], CountryEntity.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Length)({ max: 5, min: 2 }),
    (0, sequelize_typescript_1.Column)({ unique: true }),
    __metadata("design:type", String)
], CountryEntity.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.Length)({ max: 4, min: 1 }),
    (0, sequelize_typescript_1.Column)({ unique: true }),
    __metadata("design:type", String)
], CountryEntity.prototype, "phoneCode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ unique: true }),
    __metadata("design:type", String)
], CountryEntity.prototype, "currency", void 0);
__decorate([
    (0, sequelize_typescript_1.Length)({ max: 3, min: 1 }),
    (0, sequelize_typescript_1.Column)({ unique: true }),
    __metadata("design:type", String)
], CountryEntity.prototype, "currencyCode", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Object)
], CountryEntity.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Object)
], CountryEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: false }),
    __metadata("design:type", Boolean)
], CountryEntity.prototype, "active", void 0);
CountryEntity = __decorate([
    sequelize_typescript_1.Table
], CountryEntity);
exports.CountryEntity = CountryEntity;
//# sourceMappingURL=country.entity.js.map