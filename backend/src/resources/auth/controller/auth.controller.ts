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
  RegisterCraftmanDto,
  UpdateCraft,
  VerifyCraftmanDto,
} from "../dto/dto";
import { AuthGuard } from "src/core/guards/auth.guard";

@ApiTags("Authentication")
@Controller("api/v1/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    @Body() payload: RegisterCraftmanDto
  ): Promise<IResponse<{ metaData: IUser; access_token: string }>> {
    await this.authService.registerCraftman(payload);
    return {
      message: `We sent a verification code to your email`,
      status: EResponseStatus.SUCCESS,
    };
  }

  @Put("verify-craftman")
  async verifyOtpCode(
    @Body() payload: VerifyCraftmanDto
  ): Promise<IResponse<any>> {
    const req = await this.authService.verifyOtpCode(payload);
    return {
      message: "Verification successfull",
      data: req,
      status: EResponseStatus.SUCCESS,
    };
  }
}
