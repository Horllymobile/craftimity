import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { LoginDto } from "../dto/SignIn.dto";
import { IUser } from "src/core/interfaces/IUser";
import { ApiTags } from "@nestjs/swagger";
import { IResponse } from "src/core/interfaces/IResponse";
import { EResponseStatus } from "src/core/enums/ResponseStatus";
import {
  RegisterDto,
  SendOTPDto,
  UpdateCraft,
  UserCheckDto,
  VerifyCraftmanDto,
  VerifyPhoneOtpDto,
  VerifyUserDto,
} from "../dto/dto";

@ApiTags("Authentication")
@Controller("api/v1/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/register")
  async loginOrSignUp(
    @Body() payload: RegisterDto
  ): Promise<IResponse<{ metaData: IUser; access_token: string }>> {
    await this.authService.registerUser(payload);
    return {
      message: `Verification code has been sent to ${payload.email}`,
      status: EResponseStatus.SUCCESS,
      data: null,
    };
  }

  @Post("/login")
  async signIn(
    @Body() payload: LoginDto
  ): Promise<IResponse<{ metaData: IUser; access_token: string }>> {
    const user = await this.authService.signIn(payload);
    return {
      message: "User login successfully",
      status: EResponseStatus.SUCCESS,
      data: {
        metaData: user.data,
        access_token: user.access_token,
      },
    };
  }

  @Post("/register-craftman")
  async registerCraftman(
    @Body() payload: RegisterDto
  ): Promise<IResponse<{ metaData: IUser; access_token: string }>> {
    await this.authService.registerCraftman(payload);
    return {
      message: `We sent a verification code to your email`,
      status: EResponseStatus.SUCCESS,
    };
  }

  @Post("verify-craftman")
  async verifyCraftmanOtpCode(
    @Body() payload: VerifyCraftmanDto
  ): Promise<IResponse<any>> {
    const req = await this.authService.verifyCraftmanOtpCode(payload);
    return {
      message: "Verification successfull",
      data: req,
      status: EResponseStatus.SUCCESS,
    };
  }

  @Post("verify")
  async verifyOtpCode(@Body() payload: VerifyUserDto): Promise<IResponse<any>> {
    const req = await this.authService.verifyOtpCode(payload);
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
    return await this.authService.verifyPhoneOtpCode(payload);
  }

  @Patch("verify-email")
  async verifyEmailOtpCode(
    @Body() payload: VerifyPhoneOtpDto
  ): Promise<IResponse<any>> {
    return await this.authService.verifyEmailOtpCode(payload);
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
    const user = await this.authService.forgotPassword(payload);
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
    const user = await this.authService.verifyForgotPasswordOtpCode(payload);
    return {
      message: `Verfication successfuly`,
      status: EResponseStatus.SUCCESS,
      data: user,
    };
  }

  @Patch("resend-verification")
  async resendVerificationCode(
    @Body() payload: SendOTPDto
  ): Promise<IResponse<any>> {
    if (payload.type === "phone") {
      await this.authService.sendVerificationCodeToPhone(payload.phone);
      return {
        message: "We send OTP code to your phone number",
        status: EResponseStatus.SUCCESS,
      };
    }
    await this.authService.sendVerificationCodeToEmail(payload.email);
    return {
      message: "We send OTP code to your emaill address",
      status: EResponseStatus.SUCCESS,
    };
  }
}
