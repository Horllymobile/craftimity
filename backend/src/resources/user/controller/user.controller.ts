import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "../service/user.service";
import { IResponse } from "src/core/interfaces/IResponse";
import { EResponseStatus } from "src/core/enums/ResponseStatus";
import { ApiTags } from "@nestjs/swagger";
import { IUser } from "src/core/interfaces/IUser";
import { UpdateUserDto } from "../dto/user.dto";
import { IPagination } from "src/core/interfaces/IPagination";
import { AuthGuard } from "src/core/guards/auth.guard";
import { Request } from "express";
import { ERole } from "src/core/enums/Role";
import { CreateUserIdentity } from "../dto/identity.dto";
import { CreateUserAddressDto, UpdateUserAddressDto } from "../dto/dto";

@ApiTags("User")
@UseGuards(AuthGuard)
@Controller("api/v1/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findUsers(
    @Query("page") page: number = 1,
    @Query("size") size: number = 20,
    @Query("name") name?: string
  ): Promise<IResponse<IPagination<IUser[]>>> {
    const user = await this.userService.findUsers(page, size, name);
    return {
      message: "",
      data: {
        total: await this.userService.countUser(),
        page,
        size,
        data: user,
      },
      status: EResponseStatus.SUCCESS,
    };
  }

  @Get(":id")
  async findUser(@Param("id") id: string): Promise<IResponse<any>> {
    const user = await this.userService.findUserById(id);
    return {
      message: "",
      data: user,
      status: EResponseStatus.SUCCESS,
    };
  }

  @Put(":id")
  async updateUser(
    @Param("id") id: string,
    @Body() payload: UpdateUserDto,
    @Req() req: Request
  ): Promise<IResponse<any>> {
    const user = req["user"];
    if (
      user &&
      user.sub !== id &&
      (user.role !== ERole.ADMIN || user.role !== ERole.SUPER_ADMIN)
    ) {
      throw new UnauthorizedException({
        message: "Operation unallowed constact admin for support",
        status: EResponseStatus.FAILED,
      });
    }
    const data = await this.userService.updateUser(id, payload);
    return {
      message: "Update successfull",
      data: data,
      status: EResponseStatus.SUCCESS,
    };
  }

  @Patch(":id/update-password")
  async updatePassword(
    @Param("id") id: string,
    @Body() payload: { password: string }
  ): Promise<IResponse<any>> {
    const req = await this.userService.updatePassword(id, payload);
    return {
      message: "Update password successfull",
      status: EResponseStatus.SUCCESS,
      data: req,
    };
  }

  @Get("user-identity:id")
  async getUserIdentityInfo(
    @Param("id") user_id: string
  ): Promise<IResponse<any>> {
    const data = await this.userService.getUserIdentityInfo(user_id);
    return {
      message: "User Identity successfully fetched",
      status: EResponseStatus.SUCCESS,
      data,
    };
  }

  @Post(":id/address")
  async createUserLocation(
    @Param("id") user_id: string,
    @Body() payload: CreateUserAddressDto,
    @Req() req: Request
  ): Promise<IResponse<any>> {
    const user = req["user"];
    const data = await this.userService.createUserLocation(
      user_id,
      payload,
      user
    );
    return {
      message: "Address added successfully",
      status: EResponseStatus.SUCCESS,
      data,
    };
  }

  @Put(":id/address/:id")
  async updateUserLocation(
    @Param("id") id: string,
    @Body() payload: UpdateUserAddressDto,
    @Req() req: Request
  ): Promise<IResponse<any>> {
    const user = req["user"];
    const data = await this.userService.updateUserLocation(id, payload, user);
    return {
      message: "Address updated successfully",
      status: EResponseStatus.SUCCESS,
      data,
    };
  }

  @Delete(":id/address/:id")
  async deleteUserLocation(
    @Param("id") id: string,
    @Req() req: Request
  ): Promise<IResponse<any>> {
    const user = req["user"];
    const data = await this.userService.deleteUserLocation(id, user);
    return {
      message: "Address deleted successfully",
      status: EResponseStatus.SUCCESS,
      data,
    };
  }

  @Post("create-identity")
  async verifyUserIdentityInfo(
    @Body() body: CreateUserIdentity
  ): Promise<IResponse<any>> {
    await this.userService.verifyUserIdentityInfo(body);
    return {
      message: "User Identity successfully updated",
      status: EResponseStatus.SUCCESS,
    };
  }
}
