import { SuperbaseService } from "src/core/services/superbase/superbase.service";
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "src/resources/user/service/user.service";
import { LoginDto } from "../dto/SignIn.dto";
import { IUser } from "src/core/interfaces/IUser";
import { JwtService } from "@nestjs/jwt";
import { EResponseStatus } from "src/core/enums/ResponseStatus";
import { ERole } from "src/core/enums/Role";
import { RegisterCraftmanDto, VerifyCraftmanDto } from "../dto/dto";
import { jwtConstants } from "../constants/constants";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UserService,
    private superbaseService: SuperbaseService,
    private jwtService: JwtService
  ) {}

  async signIn(
    payload: LoginDto
  ): Promise<{ data: IUser; access_token: string }> {
    let user: IUser;
    if (payload.type === "email") {
      user = await this.usersService.findUserByEmailDecrypted(payload.email);
      // if (user.role === ERole.CRAFTMAN) {
      //   throw new UnauthorizedException({
      //     message: "This email ",
      //     status: EResponseStatus.FAILED,
      //   })
      // }
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
        role: user.role,
      };
      const { password, decrypted_password, ...result } = user;
      return {
        data: result,
        access_token: await this.jwtService.signAsync(jwtPayload, {
          expiresIn: payload.remember ? "5d" : jwtConstants.expiresIn,
        }),
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
    const { password, decrypted_password, ...result } = user;
    return {
      data: result,
      access_token: await this.jwtService.signAsync(jwtPayload),
    };
  }

  async registerCraftman(payload: RegisterCraftmanDto) {
    console.log(payload);
    const user = await this.usersService.findUserByEmail(payload.email);
    if (user) {
      throw new ConflictException({
        status: EResponseStatus.FAILED,
        message: "User with email already exist",
      });
    }

    let res = await this.superbaseService
      .connect()
      .from("User")
      .insert({
        first_name: payload.first_name,
        last_name: payload.last_name,
        full_name: `${payload.first_name ?? ""} ${payload.last_name ?? ""}`,
        email: payload.email,
        password: payload.password,
        role: ERole.CRAFTMAN,
      });
    if (res.error) {
      this.logger.error(res.error);
    }
    await this.usersService.sendVerificationCodeToEmail(payload.email);
  }

  async verifyOtpCode(payload: VerifyCraftmanDto) {
    let user: IUser;
    let { data, error } = await this.superbaseService
      .connect()
      .from("verification_code")
      .select("*")
      .eq("code", payload.code)
      .single();

    if (!data)
      throw new NotFoundException({
        message: "Invalid verification code",
        status: EResponseStatus.FAILED,
      });

    if (payload.type === "email") {
      let res = await this.superbaseService
        .connect()
        .from("User")
        .update({
          email_verified: true,
          active: true,
          enabled: true,
        })
        .eq("email", payload.email);

      if (res.error) {
        this.logger.error(res.error);
      }
    }

    await this.superbaseService
      .connect()
      .from("verification_code")
      .delete()
      .eq("code", payload.code);

    user = await this.usersService.findUserByEmail(payload.email);
    console.log(user);
    const jwtPayload = {
      sub: user.id,
      ...(user.email && { email: user.email }),
      ...(user.phone_number && { phone: user.phone_number }),
      type: payload.type,
    };

    const token = await this.jwtService.signAsync(jwtPayload);

    return {
      user,
      token: token,
    };
  }

  private comparePasswords(password: string, user_password: string) {
    return password === user_password;
  }
}
