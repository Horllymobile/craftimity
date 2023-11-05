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
import { UpdateCraftmanDto, VerifyCraftmanDto } from "../dto/dto";
import { ElasticService } from "src/core/services/elastic.service";
import { SchedulerRegistry } from "@nestjs/schedule";
import { ICraft } from "src/core/interfaces/ICraft";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UserService,
    private superbaseService: SuperbaseService,
    private jwtService: JwtService,
    private elasticService: ElasticService,
    private schedulerRegistry: SchedulerRegistry
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

  async registerCraftman(payload: { email: string; password: string }) {
    const user = await this.usersService.findUserByEmail(payload.email);
    if (user) {
      throw new ConflictException({
        status: EResponseStatus.FAILED,
        message: "User with email already exist",
      });
    }

    let res = await this.superbaseService.connect().from("User").insert({
      email: payload.email,
      password: payload.password,
    });

    if (res.error) {
      this.logger.error(res.error);
    }

    await this.usersService.sendVerificationCodeToEmail(payload.email);
    return user;
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
          role: ERole.CRAFTMAN,
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

  async updateCraftman(id: string, payload: UpdateCraftmanDto) {
    let user = await this.superbaseService
      .connect()
      .from("User")
      .select("*")
      .eq("id", id)
      .single();

    if (!user.data)
      throw new NotFoundException({
        message: "User not found",
        status: EResponseStatus.FAILED,
      });

    let res = await this.updateCraft(id, payload);

    if (!res.error) this.logger.error(res.error);

    let update_user = await this.updateUser(id, payload);

    if (update_user.error) this.logger.log(update_user.error);

    const mail = await this.elasticService.sendEmailDynamic({
      Recipients: {
        To: [user.data.email],
      },
      Content: {
        From: "info@craftimity.com",
        TemplateName: "WELCOMING_EMAIL",
        Subject: "Welcome to Craftimity - Let's Get Crafty Together!",
        Merge: {
          full_name: `${payload.first_name} ${payload.last_name}`,
          accountaddress: "info@craftimity.com",
        },
      },
    });
    if (mail.data) {
      this.logger.log(mail.data);
    }
  }

  async updateCraft(id: string, payload: UpdateCraftmanDto) {
    return await this.superbaseService.connect().from("crafts").insert({
      name: payload.service_name,
      business_name: payload.business_name,
      category: payload.service_category,
      is_active: true,
      user_id: id,
    });
  }

  async updateUser(id: string, payload: UpdateCraftmanDto) {
    let craft = await this.superbaseService
      .connect()
      .from("crafts")
      .select("id, name, business_name, user_id")
      .eq("user_id", id)
      .single();

    console.log(craft);

    if (!craft.data)
      throw new InternalServerErrorException({
        message: "Something happend from our side",
        status: EResponseStatus.FAILED,
      });

    return await await this.superbaseService
      .connect()
      .from("User")
      .update({
        first_name: payload.first_name,
        last_name: payload.last_name,
        full_name: `${payload.first_name ?? ""} ${payload.last_name ?? ""}`,
        country_id: payload.country,
        state_id: payload.state,
        phone_number: payload.phone_number,
        city_id: payload.city,
        birthdate: payload.birthdate,
        address: payload.address,
        craft_id: craft.data.id,
      })
      .eq("id", id);
  }

  private async updateEmail(payload: VerifyCraftmanDto) {
    let res: any;
    let user: IUser;

    res = await this.superbaseService.connect().from("User").insert({
      email: payload.email,
      email_verified: true,
      active: true,
      enabled: true,
      role: ERole.CRAFTMAN,
    });

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
      .select("id, email, active, role")
      .eq("email", payload.email)
      .single();

    user = res.data;

    return user;
  }

  // async updateCraftmanDetail(payload: ) {
  //   let res = await this.superbaseService
  //     .connect()
  //     .from("User")
  //     .select("*")
  //     .eq("id", id)
  //     .single();

  //   if (!res.data)
  //     throw new NotFoundException({
  //       message: "User not found",
  //       status: EResponseStatus.FAILED,
  //     });

  //   res = await this.superbaseService
  //     .connect()
  //     .from("User")
  //     .update({
  //       first_name: payload.first_name,
  //       last_name: payload.last_name,
  //       full_name: `${payload.first_name ?? ""} ${payload.last_name ?? ""}`,
  //       country_id: payload.country,
  //       state_id: payload.state,
  //       city_id: payload.city,
  //       birthdate: payload.birthdate,
  //       address: payload.address,
  //       password: payload.password,
  //       profile_image: payload.profile_image,
  //     })
  //     .eq("id", id);

  //   res = await this.superbaseService
  //     .connect()
  //     .from("User")
  //     .select(
  //       "first_name, last_name, email, full_name, country_id, state_id, city_id, birthdate, address, password, profile_image"
  //     )
  //     .eq("id", id)
  //     .single();
  //   const onboardingCheck = Object.values(res.data).every(
  //     (value) => value !== null
  //   );
  //   if (onboardingCheck) {
  //     await this.superbaseService
  //       .connect()
  //       .from("User")
  //       .update({
  //         is_onboarded: true,
  //       })
  //       .eq("id", id);
  //     this.elasticService
  //       .sendEmailDynamic({
  //         Recipients: {
  //           To: [res.data.email],
  //         },
  //         Content: {
  //           From: "info@craftimity.com",
  //           TemplateName: "WELCOMING_EMAIL",
  //           Subject: "Welcome to Craftimity - Let's Get Crafty Together!",
  //           Merge: {
  //             full_name: res.data.full_name,
  //             accountaddress: "info@craftimity.com",
  //           },
  //         },
  //       })
  //       .subscribe({
  //         next: (res) => {
  //           this.logger.log(res.data);
  //         },
  //         error: (err) => {
  //           this.logger.error(err);
  //           throw new InternalServerErrorException();
  //         },
  //       });
  //   }

  //   if (res.error) {
  //     this.logger.error(res.error);
  //   } else if (!res.data && res.error) {
  //     throw new InternalServerErrorException({
  //       message: "Something went wrong not your fault",
  //       status: EResponseStatus.FAILED,
  //     });
  //   }
  //   return res.data;
  // }

  private comparePasswords(password: string, user_password: string) {
    return password === user_password;
  }
}
