import { StateService } from "../service/state.service";
import { CreateStateDto } from "../dto/create-state.dto";
import { UpdateStateDto } from "../dto/update-state.dto";
import { IStateController } from "src/core/interfaces/controllers/IStateController";
import { IPagination } from "src/core/interfaces/IPagination";
import { IResponse } from "src/core/interfaces/IResponse";
import { IState } from "src/core/interfaces/IState";
import { ToogleActiveDto } from "src/core/dto/dto";
export declare class StateController implements IStateController {
    private readonly stateService;
    constructor(stateService: StateService);
    createState(payload: CreateStateDto): Promise<IResponse<IState>>;
    findStates(page?: number, size?: number, name?: string, country_id?: number): Promise<IResponse<IPagination<IState[]>>>;
    findStateById(id: number): Promise<IResponse<IState>>;
    updateState(id: number, payload: UpdateStateDto): Promise<IResponse<IState>>;
    activateIState(id: number, payload: ToogleActiveDto): Promise<IResponse<IState>>;
    deactivateIState(id: number, payload: ToogleActiveDto): Promise<IResponse<IState>>;
    deleteState(id: number): Promise<IResponse<IState>>;
}
