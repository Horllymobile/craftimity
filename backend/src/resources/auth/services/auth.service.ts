import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/resources/user/service/user.service";
import { LoginDto } from "../dto/SignIn.dto";
import { IUser } from "src/core/interfaces/IUser";
import { JwtService } from "@nestjs/jwt";
import { EResponseStatus } from "src/core/enums/ResponseStatus";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(
    payload: LoginDto
  ): Promise<{ data: IUser; access_token: string }> {
    let user: IUser;
    if (payload.type === "email") {
      user = await this.usersService.findUserByEmailDecrypted(payload.email);
      if (!user) {
        throw new UnauthorizedException({
          message: "Invalid user cridentials",
          status: EResponseStatus.FAILED,
        });
      }
      const compare = this.comparePasswords(
        payload.password,
        user.decrypted_password
      );
      if (!compare) {
        throw new UnauthorizedException({
          message: "Invalid user cridentials",
          status: EResponseStatus.FAILED,
        });
      }

      const jwtPayload = {
        sub: user.id,
        email: user.email,
        type: payload.type,
      };
      const { password, ...result } = user;
      return {
        data: result,
        access_token: await this.jwtService.signAsync(jwtPayload),
      };
    }

    user = await this.usersService.findUserByPhoneDecrypted(payload.phone);
    if (!user) {
      throw new UnauthorizedException({
        message: "Invalid user cridentials",
        status: EResponseStatus.FAILED,
      });
    }
    const compare = this.comparePasswords(
      payload.password,
      user.decrypted_password
    );

    if (!compare) {
      throw new UnauthorizedException({
        message: "Invalid user cridentials",
        status: EResponseStatus.FAILED,
      });
    }

    const jwtPayload = {
      sub: user.id,
      phone_number: user.phone_number,
      type: payload.type,
    };
    const { password, ...result } = user;
    return {
      data: result,
      access_token: await this.jwtService.signAsync(jwtPayload),
    };
  }

  private comparePasswords(password: string, user_password: string) {
    return password === user_password;
  }
}
