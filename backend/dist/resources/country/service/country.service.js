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
exports.CountryService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const country_entity_1 = require("../entities/country.entity");
const sequelize_2 = require("sequelize");
let CountryService = class CountryService {
    constructor(countryRepository) {
        this.countryRepository = countryRepository;
    }
    async createCountry(payload) {
        let country = await this.countryRepository.findOne({
            where: { name: payload.name },
        });
        if (country)
            throw new common_1.ConflictException({
                message: "Country already exist",
                statusCode: common_1.HttpStatus.CONFLICT,
            });
        country = await this.countryRepository.findOne({
            where: { code: payload.code },
        });
        if (country)
            throw new common_1.ConflictException({
                message: "Country already exist",
                statusCode: common_1.HttpStatus.CONFLICT,
            });
        country = await this.countryRepository.findOne({
            where: { currency: payload.currency },
        });
        if (country)
            throw new common_1.ConflictException({
                message: "Country already exist",
                statusCode: common_1.HttpStatus.CONFLICT,
            });
        country = await this.countryRepository.findOne({
            where: { currencyCode: payload.currencyCode },
        });
        if (country)
            throw new common_1.ConflictException({
                message: "Country already exist",
                statusCode: common_1.HttpStatus.CONFLICT,
            });
        country = await this.countryRepository.findOne({
            where: { phoneCode: payload.phoneCode },
        });
        if (country)
            throw new common_1.ConflictException({
                message: "Country already exist",
                statusCode: common_1.HttpStatus.CONFLICT,
            });
        let newCountry;
        if (payload.name === "Nigeria" ||
            payload.name === "United State of America") {
            newCountry = await this.countryRepository.create({
                name: payload.name,
                code: payload.code,
                currency: payload.currency,
                currencyCode: payload.currencyCode,
                phoneCode: payload.phoneCode,
                active: true,
            });
        }
        else {
            newCountry = await this.countryRepository.create({
                name: payload.name,
                code: payload.code,
                currency: payload.currency,
                currencyCode: payload.currencyCode,
                phoneCode: payload.phoneCode,
            });
        }
        newCountry.save();
        return {
            name: newCountry.name,
            code: newCountry.code,
            currency: newCountry.currency,
            currencyCode: newCountry.currencyCode,
            phoneCode: newCountry.phoneCode,
            active: newCountry.active,
        };
    }
    async findCountries(page = 1, size = 20, name) {
        let countries;
        page = page <= 1 ? 0 : page;
        console.log(page);
        if (!name) {
            countries = await this.countryRepository.findAll({
                limit: size,
                offset: page,
            });
        }
        else {
            countries = await this.countryRepository.findAll({
                limit: size,
                offset: page,
                where: Object.assign({}, (name && {
                    [sequelize_2.Op.or]: [
                        {
                            name: {
                                [sequelize_2.Op.like]: `%${name ? name : ""}%`,
                            },
                        },
                    ],
                })),
            });
        }
        return countries.map((country) => ({
            id: country.id,
            name: country.name,
            code: country.code,
            phoneCode: country.phoneCode,
            currency: country.currency,
            currencyCode: country.currencyCode,
            createdAt: country.createdAt,
            updatedAt: country.updatedAt,
            active: country.active,
        }));
    }
    countCountries() {
        return this.countryRepository.count();
    }
    async findCountryById(id) {
        const country = await this.countryRepository.findOne({ where: { id } });
        return {
            id: country.id,
            name: country.name,
            code: country.code,
            currency: country.currency,
            currencyCode: country.currencyCode,
            active: country.active,
            phoneCode: country.phoneCode,
            createdAt: country.createdAt,
            updatedAt: country.updatedAt,
        };
    }
    updateCountry(id, updateCountryDto) {
        return null;
    }
    deleteCountry(id) {
        return null;
    }
};
CountryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(country_entity_1.CountryEntity)),
    __metadata("design:paramtypes", [Object])
], CountryService);
exports.CountryService = CountryService;
//# sourceMappingURL=country.service.js.map