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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateEntity = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const city_entity_1 = require("../../city/entities/city.entity");
const country_entity_1 = require("src/resources/country/entities/country.entity");
let StateEntity = class StateEntity extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BIGINT, primaryKey: true }),
    __metadata("design:type", Number)
], StateEntity.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Length)({ max: 256 }),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], StateEntity.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: false }),
    __metadata("design:type", Boolean)
], StateEntity.prototype, "active", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", String)
], StateEntity.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", String)
], StateEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => country_entity_1.CountryEntity),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], StateEntity.prototype, "countryId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => country_entity_1.CountryEntity),
    __metadata("design:type", typeof (_a = typeof country_entity_1.CountryEntity !== "undefined" && country_entity_1.CountryEntity) === "function" ? _a : Object)
], StateEntity.prototype, "country", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => city_entity_1.CityEntity),
    __metadata("design:type", Array)
], StateEntity.prototype, "states", void 0);
StateEntity = __decorate([
    sequelize_typescript_1.Table
], StateEntity);
exports.StateEntity = StateEntity;
//# sourceMappingURL=state.entity.js.map