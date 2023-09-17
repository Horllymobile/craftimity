import { CreateStateDto } from "src/resources/state/dto/create-state.dto";
import { IState } from "../IState";
import { UpdateStateDto } from "src/resources/state/dto/update-state.dto";
import { IResponse } from "../IResponse";
export interface IStateService {
    createState(createStateDto: CreateStateDto): Promise<IState>;
    findStates(page: number, size: number, name?: string, country_id?: number): Promise<IState[]>;
    findStateById(id: number): Promise<IState>;
    countStates(): Promise<number>;
    toggleActiveIState(id: number, payload: {
        activate: boolean;
    }): Promise<IResponse<IState>>;
    updateState(id: number, updateStateDto: UpdateStateDto): Promise<IState>;
    deleteState(id: number): Promise<IState>;
}
