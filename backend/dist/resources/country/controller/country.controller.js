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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryController = void 0;
const common_1 = require("@nestjs/common");
const country_service_1 = require("../service/country.service");
const create_country_dto_1 = require("../dto/create-country.dto");
const update_country_dto_1 = require("../dto/update-country.dto");
const ResponseStatus_1 = require("../../../core/enums/ResponseStatus");
let CountryController = class CountryController {
    constructor(countryService) {
        this.countryService = countryService;
    }
    async createCountry(payload) {
        const country = await this.countryService.createCountry(payload);
        return {
            status: ResponseStatus_1.EResponseStatus.SUCCESS,
            message: "Created country sucessfully",
            data: country,
        };
    }
    async findCountries(page, size, name) {
        const countries = await this.countryService.findCountries(page, size, name);
        const total = await this.countryService.countCountries();
        return {
            message: "Countries fetched successfully",
            status: ResponseStatus_1.EResponseStatus.SUCCESS,
            data: {
                page,
                size,
                total,
                data: countries,
            },
        };
    }
    async findCountryById(id) {
        const country = await this.countryService.findCountryById(id);
        return {
            message: "Country retrieve successfully",
            status: ResponseStatus_1.EResponseStatus.SUCCESS,
            data: country,
        };
    }
    async updateCountry(id, updateCountryDto) {
        await this.countryService.updateCountry(id, updateCountryDto);
        return {
            message: "Country updated successfully",
            status: ResponseStatus_1.EResponseStatus.SUCCESS,
        };
    }
    async deleteCountry(id) {
        await this.countryService.deleteCountry(id);
        return {
            message: "Country deleted successfully",
            status: ResponseStatus_1.EResponseStatus.SUCCESS,
        };
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_country_dto_1.CreateCountryDto]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "createCountry", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("size")),
    __param(2, (0, common_1.Query)("name")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "findCountries", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "findCountryById", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_country_dto_1.UpdateCountryDto]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "updateCountry", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "deleteCountry", null);
CountryController = __decorate([
    (0, common_1.Controller)(`api/v1/countries`),
    __metadata("design:paramtypes", [country_service_1.CountryService])
], CountryController);
exports.CountryController = CountryController;
//# sourceMappingURL=country.controller.js.map