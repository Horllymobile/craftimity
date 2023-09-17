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
var CityService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityService = void 0;
const common_1 = require("@nestjs/common");
const superbase_service_1 = require("../../../core/services/superbase/superbase.service");
const ResponseStatus_1 = require("../../../core/enums/ResponseStatus");
let CityService = CityService_1 = class CityService {
    constructor(superBaseService) {
        this.superBaseService = superBaseService;
        this.logger = new common_1.Logger(CityService_1.name);
    }
    createCity(createCityDto) {
        throw new Error("Method not implemented.");
    }
    findCities(page, size, name) {
        throw new Error("Method not implemented.");
    }
    findCityById(id) {
        throw new Error("Method not implemented.");
    }
    countCities() {
        throw new Error("Method not implemented.");
    }
    updateCity(id, updateCityDto) {
        throw new Error("Method not implemented.");
    }
    async toggleActiveICity(id, payload) {
        let res = await this.superBaseService
            .connect()
            .from("City")
            .select("*")
            .eq("id", id)
            .single();
        if (!res.data)
            throw new common_1.NotFoundException({
                status: ResponseStatus_1.EResponseStatus.ERROR,
                message: "City not found",
            });
        res = await this.superBaseService
            .connect()
            .from("City")
            .update({ active: payload.activate })
            .eq("id", id);
        if (res.error) {
            this.logger.error(res.error);
        }
        return res.data;
    }
    deleteCity(id) {
        throw new Error("Method not implemented.");
    }
};
CityService = CityService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [superbase_service_1.SuperbaseService])
], CityService);
exports.CityService = CityService;
//# sourceMappingURL=city.service.js.map