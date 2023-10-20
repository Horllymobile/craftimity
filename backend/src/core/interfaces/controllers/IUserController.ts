import { UserCheckDto } from "src/resources/user/dto/user-check.dto";
import { IPagination } from "../IPagination";
import { IResponse } from "../IResponse";
import { VerifyUserDto } from "src/resources/user/dto/verify-user.dto";
import { IUser } from "../IUser";
import { UpdateUserDto } from "src/resources/user/dto/update-user.dto";

export interface IUserController {
  findUsers(
    page: number,
    size: number,
    name?: string
  ): Promise<IResponse<IPagination<IUser[]>>>;
  checkUser(payload: UserCheckDto): Promise<IResponse<any>>;

  updateUser(id: string, payload: UpdateUserDto): Promise<IResponse<any>>;

  verifyOtpCode(payload: VerifyUserDto): Promise<IResponse<any>>;
}
