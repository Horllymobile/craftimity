import { UserCheckDto } from "src/resources/user/dto/user-check.dto";
import { IUser } from "../IUser";
import { UpdateUserDto } from "src/resources/user/dto/update-user.dto";

export interface IUserService {
  checkUser(payload: UserCheckDto): Promise<IUser>;

  findUsers(page: number, size: number, name?: string): Promise<IUser[]>;

  findUserById(id: string): Promise<IUser>;

  findUserByEmail(email: string): Promise<IUser>;

  findUserByPhone(phone: string): Promise<IUser>;

  updateUser(id: string, payload: UpdateUserDto): Promise<any>;

  verifyOtpCode(payload: {
    email?: string;
    code: string;
    phone?: string;
    type: "email" | "phone";
  });
}
