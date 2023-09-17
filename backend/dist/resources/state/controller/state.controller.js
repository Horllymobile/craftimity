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
exports.StateController = void 0;
const common_1 = require("@nestjs/common");
const state_service_1 = require("../service/state.service");
const create_state_dto_1 = require("../dto/create-state.dto");
const update_state_dto_1 = require("../dto/update-state.dto");
const ResponseStatus_1 = require("../../../core/enums/ResponseStatus");
const dto_1 = require("../../../core/dto/dto");
let StateController = class StateController {
    constructor(stateService) {
        this.stateService = stateService;
    }
    async createState(payload) {
        const states = await this.stateService.createState(payload);
        return {
            status: ResponseStatus_1.EResponseStatus.SUCCESS,
            message: "Created country sucessfully",
            data: states,
        };
    }
    async findStates(page = 1, size = 10, name, country_id) {
        const states = await this.stateService.findStates(page, size, name, country_id);
        const total = await this.stateService.countStates();
        return {
            message: "States fetched successfully",
            status: ResponseStatus_1.EResponseStatus.SUCCESS,
            data: {
                page,
                size,
                total,
                data: states,
            },
        };
    }
    async findStateById(id) {
        const state = await this.stateService.findStateById(id);
        return {
            message: "State retrieve successfully",
            status: ResponseStatus_1.EResponseStatus.SUCCESS,
            data: state,
        };
    }
    async updateState(id, payload) {
        await this.stateService.updateState(id, payload);
        return {
            message: "State updated successfully",
            status: ResponseStatus_1.EResponseStatus.SUCCESS,
        };
    }
    async activateIState(id, payload) {
        await this.stateService.toggleActiveIState(id, payload);
        return {
            message: "State activated successfully",
            status: ResponseStatus_1.EResponseStatus.SUCCESS,
        };
    }
    async deactivateIState(id, payload) {
        await this.stateService.toggleActiveIState(id, payload);
        return {
            message: "State deactivated successfully",
            status: ResponseStatus_1.EResponseStatus.SUCCESS,
        };
    }
    async deleteState(id) {
        await this.stateService.deleteState(id);
        return {
            message: "State deleted successfully",
            status: ResponseStatus_1.EResponseStatus.SUCCESS,
        };
    }
};
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_state_dto_1.CreateStateDto]),
    __metadata("design:returntype", Promise)
], StateController.prototype, "createState", null);
__decorate([
    (0, common_1.Get)(""),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("size")),
    __param(2, (0, common_1.Query)("name")),
    __param(3, (0, common_1.Query)("country")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Number]),
    __metadata("design:returntype", Promise)
], StateController.prototype, "findStates", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StateController.prototype, "findStateById", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_state_dto_1.UpdateStateDto]),
    __metadata("design:returntype", Promise)
], StateController.prototype, "updateState", null);
__decorate([
    (0, common_1.Patch)(":id/activate"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.ToogleActiveDto]),
    __metadata("design:returntype", Promise)
], StateController.prototype, "activateIState", null);
__decorate([
    (0, common_1.Patch)(":id/deactivate"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.ToogleActiveDto]),
    __metadata("design:returntype", Promise)
], StateController.prototype, "deactivateIState", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StateController.prototype, "deleteState", null);
StateController = __decorate([
    (0, common_1.Controller)("api/v1/states"),
    __metadata("design:paramtypes", [state_service_1.StateService])
], StateController);
exports.StateController = StateController;
//# sourceMappingURL=state.controller.js.map