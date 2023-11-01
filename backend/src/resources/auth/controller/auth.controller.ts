import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { LoginDto } from "../dto/SignIn.dto";
import { IUser } from "src/core/interfaces/IUser";
import { ApiTags } from "@nestjs/swagger";
import { IResponse } from "src/core/interfaces/IResponse";
import { EResponseStatus } from "src/core/enums/ResponseStatus";

@ApiTags("User")
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
}
