import { IPagination } from "../IPagination";
import { IResponse } from "../IResponse";
import { IUser } from "../IUser";
import { UpdateUserDto } from "src/resources/user/dto/user.dto";

export interface IUserController {
  findUsers(
    page: number,
    size: number,
    name?: string
  ): Promise<IResponse<IPagination<IUser[]>>>;

  updateUser(id: string, payload: UpdateUserDto): Promise<IResponse<any>>;

  updatePassword(
    id: string,
    payload: { password: string }
  ): Promise<IResponse<any>>;
}
