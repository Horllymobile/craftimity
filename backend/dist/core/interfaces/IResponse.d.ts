import { EResponseStatus } from "../enums/ResponseStatus";
export interface IResponse<T> {
    status: EResponseStatus;
    message: string;
    data?: T;
}
