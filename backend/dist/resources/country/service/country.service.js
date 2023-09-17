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
var CountryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryService = void 0;
const common_1 = require("@nestjs/common");
const superbase_service_1 = require("../../../core/services/superbase/superbase.service");
const ResponseStatus_1 = require("../../../core/enums/ResponseStatus");
let CountryService = CountryService_1 = class CountryService {
    constructor(superBaseService) {
        this.superBaseService = superBaseService;
        this.logger = new common_1.Logger(CountryService_1.name);
    }
    async createCountry(payload) {
        let res = await this.superBaseService
            .connect()
            .from("Country")
            .select("*")
            .eq("name", payload.name)
            .single();
        if (res.data)
            throw new common_1.ConflictException({
                status: ResponseStatus_1.EResponseStatus.ERROR,
                message: "Country already exist",
            });
        res = await this.superBaseService
            .connect()
            .from("Country")
            .select("*")
            .eq("code", payload.code)
            .single();
        if (res.data)
            throw new common_1.ConflictException({
                status: ResponseStatus_1.EResponseStatus.ERROR,
                message: "Country already exist",
            });
        res = await this.superBaseService
            .connect()
            .from("Country")
            .select("*")
            .eq("currency", payload.currency)
            .single();
        if (res.data)
            throw new common_1.ConflictException({
                status: ResponseStatus_1.EResponseStatus.ERROR,
                message: "Country already exist",
            });
        res = await this.superBaseService
            .connect()
            .from("Country")
            .select("*")
            .eq("currency_code", payload.currencyCode)
            .single();
        if (res.data)
            throw new common_1.ConflictException({
                status: ResponseStatus_1.EResponseStatus.ERROR,
                message: "Country already exist",
            });
        res = await this.superBaseService
            .connect()
            .from("Country")
            .select("*")
            .eq("phone_code", payload.phoneCode)
            .single();
        if (res.data)
            throw new common_1.ConflictException({
                status: ResponseStatus_1.EResponseStatus.ERROR,
                message: "Country already exist",
            });
        res = await this.superBaseService
            .connect()
            .from("Country")
            .select("*")
            .eq("symbol", payload.currencySymbol)
            .single();
        if (res.data)
            throw new common_1.ConflictException({
                status: ResponseStatus_1.EResponseStatus.ERROR,
                message: "Country already exist",
            });
        res = await this.superBaseService.connect().from("Country").insert({
            name: payload.name,
            code: payload.code,
            phone_code: payload.phoneCode,
            currency: payload.currency,
            currency_code: payload.currencyCode,
            symbol: payload.currencySymbol,
        });
        if (res.error) {
            this.logger.error(res.error);
        }
        return res.data;
    }
    async findCountries(page = 1, size = 20, name) {
        page = page <= 1 ? 0 : page;
        if (name) {
            let { data, error } = await this.superBaseService
                .connect()
                .from("Country")
                .select("id, name, code, currency, currency_code, phone_code, active, created_at, updated_at, symbol")
                .ilike("name", `%${name}%`)
                .limit(size)
                .order("id", { ascending: true })
                .range(page, size);
            if (error) {
                this.logger.error(error);
            }
            return data !== null && data !== void 0 ? data : [];
        }
        let { data, error } = await this.superBaseService
            .connect()
            .from("Country")
            .select("id, name, code, currency, currency_code, phone_code, active, created_at, updated_at, symbol")
            .limit(size)
            .order("id", { ascending: true })
            .range(page, size);
        if (error) {
            this.logger.error(error);
        }
        return data;
    }
    async countCountries() {
        let { data, count } = await this.superBaseService
            .connect()
            .from("Country")
            .select("*", { count: "exact", head: true });
        return count;
    }
    async findCountryById(id) {
        let res = await this.superBaseService
            .connect()
            .from("Country")
            .select("*")
            .eq("id", id)
            .single();
        if (!res.data)
            throw new common_1.NotFoundException({
                status: ResponseStatus_1.EResponseStatus.ERROR,
                message: "Country not found",
            });
        return res.data;
    }
    async updateCountry(id, payload) {
        let res = await this.superBaseService
            .connect()
            .from("Country")
            .select("*")
            .eq("id", id)
            .single();
        if (!res.data)
            throw new common_1.NotFoundException({
                status: ResponseStatus_1.EResponseStatus.ERROR,
                message: "Country not found",
            });
        res = await this.superBaseService
            .connect()
            .from("Country")
            .update({
            name: payload.name,
            code: payload.code,
            phone_code: payload.phoneCode,
            currency: payload.currency,
            currency_code: payload.currencyCode,
            symbol: payload.currencySymbol,
        })
            .eq("id", id);
        if (res.error) {
            this.logger.error(res.error);
        }
        return res.data;
    }
    async toggleActiveICountry(id, payload) {
        let res = await this.superBaseService
            .connect()
            .from("Country")
            .select("*")
            .eq("id", id)
            .single();
        if (!res.data)
            throw new common_1.NotFoundException({
                status: ResponseStatus_1.EResponseStatus.ERROR,
                message: "Country not found",
            });
        res = await this.superBaseService
            .connect()
            .from("Country")
            .update({ active: payload.activate })
            .eq("id", id);
        if (res.error) {
            this.logger.error(res.error);
        }
        return res.data;
    }
    async deleteCountry(id) {
        let res = await this.superBaseService
            .connect()
            .from("Country")
            .select("*")
            .eq("id", id)
            .single();
        if (!res.data)
            throw new common_1.NotFoundException({
                status: ResponseStatus_1.EResponseStatus.ERROR,
                message: "Country not found",
            });
        let { data, error } = await this.superBaseService
            .connect()
            .from("Country")
            .delete()
            .eq("id", id);
        if (res.error) {
            this.logger.error(error);
            throw new common_1.BadRequestException({
                message: error.message,
                status: ResponseStatus_1.EResponseStatus.ERROR,
            });
        }
        return data;
    }
};
CountryService = CountryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [superbase_service_1.SuperbaseService])
], CountryService);
exports.CountryService = CountryService;
//# sourceMappingURL=country.service.js.map