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
var StateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateService = void 0;
const common_1 = require("@nestjs/common");
const superbase_service_1 = require("../../../core/services/superbase/superbase.service");
const ResponseStatus_1 = require("../../../core/enums/ResponseStatus");
let StateService = StateService_1 = class StateService {
    constructor(superBaseService) {
        this.superBaseService = superBaseService;
        this.logger = new common_1.Logger(StateService_1.name);
    }
    async createState(payload) {
        let res = await this.superBaseService
            .connect()
            .from("State")
            .select("*")
            .eq("name", payload.name)
            .single();
        if (res.data)
            throw new common_1.ConflictException({
                status: ResponseStatus_1.EResponseStatus.ERROR,
                message: "State already exist",
            });
        res = await this.superBaseService.connect().from("State").insert({
            name: payload.name,
            country_id: payload.country_id,
        });
        if (res.error) {
            this.logger.error(res.error);
        }
        return res.data;
    }
    async findStates(page, size, name, country_id) {
        var _a;
        page = page <= 1 ? 0 : page;
        let res;
        if (name && country_id) {
            res = await this.superBaseService
                .connect()
                .from("State")
                .select("id, name, active, country_id, created_at, updated_at, Country(id, name, code)")
                .ilike("name", `%${name}%`)
                .limit(size)
                .eq("country_id", country_id)
                .order("id", { ascending: true })
                .range(page, size);
        }
        else if (name) {
            res = await this.superBaseService
                .connect()
                .from("State")
                .select("id, name, active, country_id, created_at, updated_at, Country(id, name, code)")
                .ilike("name", `%${name}%`)
                .limit(size)
                .eq("country_id", country_id)
                .order("id", { ascending: true })
                .range(page, size);
        }
        else if (country_id) {
            res = await this.superBaseService
                .connect()
                .from("State")
                .select("id, name, active, country_id, created_at, updated_at, Country(id, name, code)")
                .eq("country_id", country_id)
                .limit(size)
                .order("id", { ascending: true })
                .range(page, size);
        }
        else {
            res = await this.superBaseService
                .connect()
                .from("State")
                .select("id, name, active, country_id, created_at, updated_at, Country(id, name, code)")
                .limit(size)
                .order("id", { ascending: true })
                .range(page, size);
        }
        if (res.error) {
            this.logger.error(res.error);
        }
        return (_a = res.data) !== null && _a !== void 0 ? _a : [];
    }
    async findStateById(id) {
        let res = await this.superBaseService
            .connect()
            .from("State")
            .select("*")
            .eq("id", id)
            .single();
        if (!res.data)
            throw new common_1.NotFoundException({
                status: ResponseStatus_1.EResponseStatus.ERROR,
                message: "State not found",
            });
        return res.data;
    }
    async countStates() {
        let { data, count } = await this.superBaseService
            .connect()
            .from("State")
            .select("*", { count: "exact", head: true });
        return count;
    }
    async updateState(id, payload) {
        let res = await this.superBaseService
            .connect()
            .from("State")
            .select("*")
            .eq("id", id)
            .single();
        if (!res.data)
            throw new common_1.NotFoundException({
                status: ResponseStatus_1.EResponseStatus.ERROR,
                message: "State not found",
            });
        res = await this.superBaseService
            .connect()
            .from("State")
            .update({
            name: payload.name,
        })
            .eq("id", id);
        if (res.error) {
            this.logger.error(res.error);
        }
        return res.data;
    }
    async toggleActiveIState(id, payload) {
        let res = await this.superBaseService
            .connect()
            .from("State")
            .select("*")
            .eq("id", id)
            .single();
        if (!res.data)
            throw new common_1.NotFoundException({
                status: ResponseStatus_1.EResponseStatus.ERROR,
                message: "State not found",
            });
        res = await this.superBaseService
            .connect()
            .from("State")
            .update({ active: payload.activate })
            .eq("id", id);
        if (res.error) {
            this.logger.error(res.error);
        }
        return res.data;
    }
    async deleteState(id) {
        let res = await this.superBaseService
            .connect()
            .from("State")
            .select("*")
            .eq("id", id)
            .single();
        if (!res.data)
            throw new common_1.NotFoundException({
                status: ResponseStatus_1.EResponseStatus.ERROR,
                message: "State not found",
            });
        let { data, error } = await this.superBaseService
            .connect()
            .from("State")
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
StateService = StateService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [superbase_service_1.SuperbaseService])
], StateService);
exports.StateService = StateService;
//# sourceMappingURL=state.service.js.map