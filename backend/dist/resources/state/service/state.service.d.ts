import { CreateStateDto } from "../dto/create-state.dto";
import { UpdateStateDto } from "../dto/update-state.dto";
import { IStateService } from "src/core/interfaces/services/IStateService";
import { IState } from "src/core/interfaces/IState";
import { SuperbaseService } from "src/core/services/superbase/superbase.service";
import { IResponse } from "src/core/interfaces/IResponse";
export declare class StateService implements IStateService {
    private readonly superBaseService;
    private readonly logger;
    constructor(superBaseService: SuperbaseService);
    createState(payload: CreateStateDto): Promise<IState>;
    findStates(page: number, size: number, name?: string, country_id?: number): Promise<IState[]>;
    findStateById(id: number): Promise<IState>;
    countStates(): Promise<number>;
    updateState(id: number, payload: UpdateStateDto): Promise<IState>;
    toggleActiveIState(id: number, payload: {
        activate: boolean;
    }): Promise<IResponse<IState>>;
    deleteState(id: number): Promise<IState>;
}
