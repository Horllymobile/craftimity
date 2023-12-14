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
import {
  RegisterDto,
  UserCheckDto,
  VerifyCraftmanDto,
  VerifyPhoneOtpDto,
  VerifyUserDto,
} from "../dto/dto";
import { jwtConstants } from "../constants/constants";
import { USERCHECKTYPE } from "src/core/enums/UserCheckType";
import { ElasticService } from "src/core/services/elastic.service";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UserService,
    private superbaseService: SuperbaseService,
    private jwtService: JwtService,
    private elasticService: ElasticService
  ) {}

  async signIn(
    payload: LoginDto
  ): Promise<{ data: IUser; access_token: string }> {
    let user: any;
    if (payload.type === "email") {
      user = await this.usersService.findUserByEmailDecrypted(payload.email);
      if (!user) {
        throw new UnauthorizedException({
          message: "Invalid user cridentials",
          status: EResponseStatus.FAILED,
        });
      }

      // if (user && !user.active) {
      //   throw new UnauthorizedException({
      //     status: EResponseStatus.FAILED,
      //     message: "Your account is yet to be verified",
      //   });
      // }

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

  async registerUser(payload: RegisterDto) {
    if (payload.is_artisan) {
      await this.usersService.createUser(payload, ERole.CRAFTMAN);
    } else {
      await this.usersService.createUser(payload);
    }
  }

  async registerCraftman(payload: RegisterDto) {
    await this.usersService.createUser(payload, ERole.CRAFTMAN);
  }

  async verifyOtpCode(payload: VerifyUserDto) {
    let user: any;
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
          updated_at: new Date().toISOString(),
        })
        .eq("email", payload.email);

      if (res.error) {
        this.logger.error(res.error);
      }
    }

    if (error) {
      this.logger.error(error);
    }

    user = await this.usersService.findUserByEmail(payload.email);

    await this.usersService.sendWelcomingEmail(user);

    await this.superbaseService
      .connect()
      .from("verification_code")
      .delete()
      .eq("code", payload.code);
  }

  async verifyCraftmanOtpCode(payload: VerifyCraftmanDto) {
    let user: any;
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
          updated_at: new Date().toISOString(),
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

  async verifyPhoneOtpCode(payload: VerifyPhoneOtpDto) {
    const user = await this.usersService.findUserByPhone(payload.phone);
    if (user) {
      throw new ConflictException({
        status: EResponseStatus.FAILED,
        message: "Phone number already in use",
      });
    }
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

    let res: any;

    if (payload.phone === "+2348095687112") {
      res = await this.superbaseService
        .connect()
        .from("User")
        .update({
          phone_number: payload.phone,
          phone_verified: true,
          role: ERole.SUPER_ADMIN,
          updated_at: new Date().toISOString(),
        })
        .eq("email", payload.email);
    } else {
      res = await this.superbaseService
        .connect()
        .from("User")
        .update({
          phone_number: payload.phone,
          phone_verified: true,
          role: ERole.USER,
          updated_at: new Date().toISOString(),
        })
        .eq("email", payload.email);
    }

    if (res.error) {
      this.logger.error(res.error);
      throw new InternalServerErrorException({
        message: "Something went wrong not your fault",
        status: EResponseStatus.ERROR,
      });
    }

    if (res.error) {
      this.logger.error(res.error);
      throw new InternalServerErrorException({
        message: "Something went wrong not your fault",
        status: EResponseStatus.ERROR,
      });
    }

    await this.superbaseService
      .connect()
      .from("verification_code")
      .delete()
      .eq("code", payload.code);
    return {
      message: "Verification successfull",
      status: EResponseStatus.SUCCESS,
    };
  }

  async verifyEmailOtpCode(payload: VerifyPhoneOtpDto) {
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

    let res: any;

    if (payload.email === "horlamidex1@gmail.com") {
      res = await this.superbaseService
        .connect()
        .from("User")
        .update({
          email: payload.email,
          email_verified: true,
          role: ERole.SUPER_ADMIN,
          updated_at: new Date().toISOString(),
        })
        .eq("phone_number", payload.phone);
    } else {
      res = await this.superbaseService
        .connect()
        .from("User")
        .update({
          email: payload.email,
          email_verified: true,
          role: ERole.USER,
          updated_at: new Date().toISOString(),
        })
        .eq("phone_number", payload.phone);
    }

    if (res.error) {
      this.logger.error(res.error);
      throw new InternalServerErrorException({
        message: "Something went wrong not your fault",
        status: EResponseStatus.ERROR,
      });
    }

    if (res.error) {
      this.logger.error(res.error);
      throw new InternalServerErrorException({
        message: "Something went wrong not your fault",
        status: EResponseStatus.ERROR,
      });
    }

    await this.superbaseService
      .connect()
      .from("verification_code")
      .delete()
      .eq("code", payload.code);
    return {
      message: "Verification successfull",
      status: EResponseStatus.SUCCESS,
    };
  }

  async verifyForgotPasswordOtpCode(payload: VerifyUserDto) {
    let user: any;
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
      user = await this.usersService.findUserByEmail(payload.email);
    } else {
      user = await this.usersService.findUserByPhone(payload.phone);
    }

    await this.superbaseService
      .connect()
      .from("verification_code")
      .delete()
      .eq("code", payload.code);

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

  async forgotPassword(payload: {
    email?: string;
    phone?: string;
    type: "email" | "phone";
  }) {
    let user: any;
    if (payload.type === USERCHECKTYPE.EMAIL) {
      user = await this.usersService.findUserByEmail(payload.email);
      console.log(user);
      if (!user)
        throw new NotFoundException({
          message: "User not found",
          status: EResponseStatus.FAILED,
        });
      if (user) {
        const sent = await this.usersService.sendForgotPasswordCodeToEmail(
          payload.email
        );
        console.log(sent);
      }
      return user;
    }

    user = await this.usersService.findUserByPhone(payload.phone);
    if (!user)
      throw new NotFoundException({
        message: "User not found",
        status: EResponseStatus.FAILED,
      });
    if (user) {
      await this.usersService.sendVerificationCodeToPhone(payload.phone);
    }
    return user;
  }

  async sendVerificationCodeToPhone(phone: string) {
    await this.usersService.sendVerificationCodeToPhone(phone);
  }
  async sendVerificationCodeToEmail(email: string) {
    await this.usersService.sendVerificationCodeToEmail(email);
  }

  private comparePasswords(password: string, user_password: string) {
    return password === user_password;
  }

  private async activateAndEnableUser(payload: {
    email?: string;
    phone?: string;
    type: "email" | "phone";
  }) {
    let res;

    if (payload.type === "phone") {
      res = await this.superbaseService
        .connect()
        .from("User")
        .select("*")
        .eq("phone_number", payload.phone)
        .single();
    } else {
      res = await this.superbaseService
        .connect()
        .from("User")
        .select("*")
        .eq("email", payload.email)
        .single();
    }

    if (!res) {
      this.logger.error(res.error);
      throw new InternalServerErrorException({
        message: "Something went wrong not your fault",
        status: EResponseStatus.ERROR,
      });
    }
    if (res.data?.phone_verified && res.data?.email_verified) {
      if (payload.type === "phone") {
        res = await this.superbaseService
          .connect()
          .from("User")
          .update({
            active: true,
            enabled: true,
            updated_at: new Date().toISOString(),
          })
          .eq("phone_number", payload.phone);
      } else {
        res = await this.superbaseService
          .connect()
          .from("User")
          .update({
            active: true,
            enabled: true,
            updated_at: new Date().toISOString(),
          })
          .eq("email", payload.email);
      }
    }
  }

  private async updateEmail(payload: VerifyUserDto) {
    let res: any;
    let user: IUser;
    if (payload.email === "horlamidex1@gmail.com") {
      res = await this.superbaseService.connect().from("User").insert({
        email: payload.email,
        email_verified: true,
        active: true,
        enabled: true,
        role: ERole.SUPER_ADMIN,
      });
    } else {
      res = await this.superbaseService.connect().from("User").insert({
        email: payload.email,
        email_verified: true,
        active: true,
        enabled: true,
        role: ERole.USER,
      });
    }

    if (res.error) {
      this.logger.error(res.error);
      throw new InternalServerErrorException({
        message: "Something went wrong not your fault",
        status: EResponseStatus.ERROR,
      });
    }

    if (res.error) {
      this.logger.error(res.error);
      throw new InternalServerErrorException({
        message: "Something went wrong not your fault",
        status: EResponseStatus.ERROR,
      });
    }

    res = await this.superbaseService
      .connect()
      .from("User")
      .select(
        `id,first_name,last_name, email, 
      phone_number, address, active, enabled, email_verified, 
      phone_verified, role, created_at, 
      updated_at, country_id, state_id, city_id`
      )
      .eq("email", payload.email)
      .single();

    user = res.data;
    return user;
  }

  private async updatePhone(payload: VerifyUserDto) {
    let res: any;
    let user: IUser;
    if (payload.phone === "+2348095687112") {
      res = await this.superbaseService.connect().from("User").insert({
        phone_number: payload.phone,
        phone_verified: true,
        active: true,
        enabled: true,
        role: ERole.SUPER_ADMIN,
      });
    } else {
      res = await this.superbaseService.connect().from("User").insert({
        phone_number: payload.phone,
        phone_verified: true,
        active: true,
        enabled: true,
        role: ERole.USER,
      });
    }

    if (res.error) {
      this.logger.error(res.error);
      throw new InternalServerErrorException({
        message: "Something went wrong not your fault",
        status: EResponseStatus.ERROR,
      });
    }

    if (res.error) {
      this.logger.error(res.error);
      throw new InternalServerErrorException({
        message: "Something went wrong not your fault",
        status: EResponseStatus.ERROR,
      });
    }

    res = await this.superbaseService
      .connect()
      .from("User")
      .select(
        `id,first_name,last_name, email, 
      phone_number, address, active, enabled, email_verified, 
      phone_verified, role, created_at, 
      updated_at, country_id, state_id, city_id`
      )
      .eq("phone_number", payload.phone)
      .single();

    console.log(res);

    user = res.data;
    return user;
  }
}
