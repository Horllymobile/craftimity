import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "../service/user.service";
import { IUserController } from "src/core/interfaces/controllers/IUserController";
import { IResponse } from "src/core/interfaces/IResponse";
import { UserCheckDto } from "../dto/user-check.dto";
import { EResponseStatus } from "src/core/enums/ResponseStatus";
import { ApiTags } from "@nestjs/swagger";
import {
  SendOTPDto,
  VerifyPhoneOtpDto,
  VerifyUserDto,
} from "../dto/verify-user.dto";
import { IUser } from "src/core/interfaces/IUser";
import { UpdateUserDto } from "../dto/update-user.dto";
import { IPagination } from "src/core/interfaces/IPagination";
import { AuthGuard } from "src/core/guards/auth.guard";
import { Public } from "src/core/decorators/public-route";

@ApiTags("User")
@Controller("api/v1/users")
export class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Get(":id")
  async findUser(@Param("id") id: string): Promise<IResponse<IUser>> {
    const user = await this.userService.findUserById(id);
    return {
      message: "",
      data: user,
      status: EResponseStatus.SUCCESS,
    };
  }

  @Public()
  @Post("/check")
  async checkUser(
    @Body() payload: UserCheckDto
  ): Promise<IResponse<IUser | { message: string }>> {
    const check = await this.userService.checkUser(payload);
    return {
      message: check
        ? "User check success"
        : `We sent a verification code to your ${
            payload.type === "email" ? "email address" : "phone number"
          }`,
      data: check,
      status: EResponseStatus.SUCCESS,
    };
  }

  @UseGuards(AuthGuard)
  @Put(":id")
  async updateUser(
    @Param("id") id: string,
    @Body() payload: UpdateUserDto
  ): Promise<IResponse<any>> {
    const data = await this.userService.updateUser(id, payload);
    return {
      message: "Update successfull",
      data: data,
      status: EResponseStatus.SUCCESS,
    };
  }

  @Patch("verify")
  async verifyOtpCode(@Body() payload: VerifyUserDto): Promise<IResponse<any>> {
    const req = await this.userService.verifyOtpCode(payload);
    return {
      message: "Verification successfull",
      data: req,
      status: EResponseStatus.SUCCESS,
    };
  }

  @Patch("verify-phone")
  async verifyPhoneOtpCode(
    @Body() payload: VerifyPhoneOtpDto
  ): Promise<IResponse<any>> {
    return await this.userService.verifyPhoneOtpCode(payload);
  }

  @Patch("verify-email")
  async verifyEmailOtpCode(
    @Body() payload: VerifyPhoneOtpDto
  ): Promise<IResponse<any>> {
    return await this.userService.verifyEmailOtpCode(payload);
  }

  @Post("forgot-password")
  async forgotPassword(
    @Body()
    payload: {
      email?: string;
      phone?: string;
      type: "email" | "phone";
    }
  ): Promise<IResponse<any>> {
    const user = await this.userService.forgotPassword(payload);
    return {
      message: `Verfication code have been sent to ${
        payload.type === "email" ? payload.email : payload.phone
      }`,
      status: EResponseStatus.SUCCESS,
      data: user,
    };
  }

  @Post("verify-reset-password")
  async verifyPasswordOtpCode(
    @Body()
    payload: VerifyUserDto
  ): Promise<IResponse<any>> {
    const user = await this.userService.verifyForgotPasswordOtpCode(payload);
    return {
      message: `Verfication successfuly`,
      status: EResponseStatus.SUCCESS,
      data: user,
    };
  }

  @UseGuards(AuthGuard)
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

  @Patch("resend-verification")
  async resendVerificationCode(
    @Body() payload: SendOTPDto
  ): Promise<IResponse<any>> {
    console.log(payload);
    if (payload.type === "phone") {
      await this.userService.sendVerificationCodeToPhone(payload.phone);
      return {
        message: "We send OTP code to your phone number",
        status: EResponseStatus.SUCCESS,
      };
    }
    await this.userService.sendVerificationCodeToEmail(payload.email);
    return {
      message: "We send OTP code to your emaill address",
      status: EResponseStatus.SUCCESS,
    };
  }
}
