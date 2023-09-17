import { IResponse } from "../IResponse";
import { IPagination } from "../IPagination";
import { IState } from "../IState";
import { UpdateStateDto } from "src/resources/state/dto/update-state.dto";
import { CreateStateDto } from "src/resources/state/dto/create-state.dto";

export interface IStateController {
  createState(payload: CreateStateDto): Promise<IResponse<IState>>;

  findStates(
    page: number,
    size: number,
    name?: string
  ): Promise<IResponse<IPagination<IState[]>>>;

  findStateById(id: number): Promise<IResponse<IState>>;

  updateState(id: number, payload: UpdateStateDto): Promise<IResponse<IState>>;

  activateIState(
    id: number,
    payload: { activate: boolean }
  ): Promise<IResponse<IState>>;

  deactivateIState(
    id: number,
    payload: { activate: boolean }
  ): Promise<IResponse<IState>>;

  deleteState(id: number): Promise<IResponse<IState>>;
}
