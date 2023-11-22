import { IUser } from "../IUser";
import { UpdateUserDto } from "src/resources/user/dto/user.dto";

export interface IUserService {
  findUsers(page: number, size: number, name?: string): Promise<IUser[]>;

  findUserById(id: string): Promise<IUser>;

  findUserByEmail(email: string): Promise<IUser>;

  findUserByPhone(phone: string): Promise<IUser>;

  updateUser(id: string, payload: UpdateUserDto): Promise<any>;

  updatePassword(id: string, payload: { password: string }): Promise<any>;

  deleteCraftsman?(id: string): Promise<any>;

  toggleCraftsmanStatus?(id: string): Promise<any>;
}
