import { SendgridService } from "../../../core/services/sendgrid.service";
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { UserCheckDto } from "../dto/user-check.dto";
import { IUserService } from "src/core/interfaces/services/IUserService";
import { SuperbaseService } from "src/core/services/superbase/superbase.service";
import { USERCHECKTYPE } from "src/core/enums/UserCheckType";
import { EResponseStatus } from "src/core/enums/ResponseStatus";
import { IUser } from "src/core/interfaces/IUser";
import { generateVerifcationCode } from "src/core/utils/verification-code";
import { VerifyPhoneOtpDto, VerifyUserDto } from "../dto/verify-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { ERole } from "src/core/enums/Role";
import { JwtService } from "@nestjs/jwt";
import { EmailMessage, EmailTemplate } from "src/core/models/email-template";
import { PhoneMessageService } from "src/core/services/phone.service";

@Injectable()
export class UserService implements IUserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly superBaseService: SuperbaseService,
    private jwtService: JwtService,
    private phoneMessageService: PhoneMessageService
  ) {}

  async checkUser(payload: UserCheckDto): Promise<any> {
    let user: IUser;
    if (payload.type === USERCHECKTYPE.EMAIL) {
      user = await this.findUserByEmail(payload.email);
      if (!user) {
        await this.sendVerificationCodeToEmail(payload.email);
        return null;
      }
      return user;
    }
    user = await this.findUserByPhone(payload.phone);
    if (!user) {
      await this.sendVerificationCodeToPhone(payload.phone);
      return null;
    }
    return user;
  }

  async countUser() {
    let { data, count }: { data: IUser[]; count: number } =
      await this.superBaseService
        .connect()
        .from("User")
        .select("*", { count: "exact", head: true });

    return count;
  }

  async findUsers(page: number, size: number, name?: string): Promise<IUser[]> {
    page = page <= 1 ? 0 : page;
    let res: any;

    if (name) {
      res = await this.superBaseService
        .connect()
        .from("User")
        .select(
          `id,first_name,last_name, full_name, email, 
        phone_number, address, active, enabled, email_verified, 
        phone_verified, role, created_at, 
        updated_at, country_id, state_id, city_id`
        )
        .ilike("idx_user_name", `%${name}%`)
        .limit(size)
        .order("id", { ascending: true })
        .eq("active", true)
        .range(page, size);
    } else {
      res = await this.superBaseService
        .connect()
        .from("User")
        .select(
          `id,first_name,last_name, email, 
        phone_number, address, active, enabled, email_verified, 
        phone_verified, role, created_at, 
        updated_at, country_id, state_id, city_id`
        )
        .limit(size)
        .eq("active", true)
        .range(page, size);
    }

    if (res.error) {
      this.logger.error(res.error);
    }
    return res.data;
  }

  async findUserById(id: string): Promise<IUser> {
    let { data, error } = await this.superBaseService
      .connect()
      .from("User")
      .select(
        `id,first_name,last_name, full_name, email, 
      phone_number, address, active, enabled, email_verified, 
      phone_verified, role, created_at, 
      updated_at, country_id, state_id, city_id`
      )
      .eq("id", id)
      .single();

    if (error) {
      this.logger.error(error);
    }

    return data;
  }

  async findUserByEmail(email: string): Promise<IUser> {
    let { data, error } = await this.superBaseService
      .connect()
      .from("User")
      .select(
        `id,first_name,last_name, full_name, email, 
      phone_number, address, active, enabled, email_verified, 
      phone_verified, role, created_at, 
      updated_at, country_id, state_id, city_id, birthdate, password`
      )
      .eq("email", email)
      .single();
    if (error) {
      this.logger.error(error);
    }

    return data;
  }

  async findUserByEmailDecrypted(email: string): Promise<IUser> {
    let { data, error } = await this.superBaseService
      .connect()
      .from("decrypted_User")
      .select(
        `id,first_name,last_name, full_name, email, 
      phone_number, address, active, enabled, email_verified, 
      phone_verified, role, created_at, 
      updated_at, country_id, state_id, city_id, birthdate, password, decrypted_password`
      )
      .eq("email", email)
      .single();
    if (error) {
      this.logger.error(error);
    }

    return data;
  }

  async findUserByPhone(phone: string): Promise<IUser> {
    let { data, error } = await this.superBaseService
      .connect()
      .from("User")
      .select(
        `id,first_name,last_name, full_name, email, 
      phone_number, address, active, enabled, email_verified, 
      phone_verified, role, created_at, 
      updated_at, country_id, state_id, city_id, password`
      )
      .eq("phone_number", phone)
      .single();

    if (error) {
      this.logger.error(error);
    }

    return data;
  }

  async findUserByPhoneDecrypted(phone: string): Promise<IUser> {
    let { data, error } = await this.superBaseService
      .connect()
      .from("decrypted_User")
      .select(
        `id,first_name,last_name, full_name, email, 
      phone_number, address, active, enabled, email_verified, 
      phone_verified, role, created_at, 
      updated_at, country_id, state_id, city_id, password, decrypted_password`
      )
      .eq("phone_number", phone)
      .single();

    if (error) {
      this.logger.error(error);
    }

    return data;
  }

  async sendVerificationCodeToEmail(email: string) {
    const code = generateVerifcationCode(6);
    console.log("Email OTP code " + code);
    let res = await this.superBaseService
      .connect()
      .from("verification_code")
      .select("*")
      .eq("email", email);

    if (res.data) {
      await this.superBaseService
        .connect()
        .from("verification_code")
        .delete()
        .eq("email", email);
    }
    let { data, error } = await this.superBaseService
      .connect()
      .from("verification_code")
      .insert({
        email: email,
        code,
      });
    if (error) {
      this.logger.error(error);
    }
    return;
  }

  async sendVerificationCodeToPhone(phone: string) {
    const code = generateVerifcationCode(6);
    console.log("Phone OTP code " + code);
    let res = await this.superBaseService
      .connect()
      .from("verification_code")
      .select("*")
      .eq("phone", phone);

    if (res.data) {
      await this.superBaseService
        .connect()
        .from("verification_code")
        .delete()
        .eq("phone", phone);
    }
    let { data, error } = await this.superBaseService
      .connect()
      .from("verification_code")
      .insert({
        phone: phone,
        code,
      });
    this.phoneMessageService
      .sendVerificationCode({ phoneNumber: phone, verifyCode: code })
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
    if (error) {
      this.logger.error(error);
    }
    return;
  }

  async updateUser(
    id: string,
    payload: UpdateUserDto
  ): Promise<{ message: string }> {
    let { data, error } = await this.superBaseService
      .connect()
      .from("User")
      .select("*")
      .eq("id", id)
      .single();

    if (!data)
      throw new NotFoundException({
        message: "User not found",
        status: EResponseStatus.FAILED,
      });

    let res = await this.superBaseService
      .connect()
      .from("User")
      .update({
        first_name: payload.first_name,
        last_name: payload.last_name,
        full_name: `${payload.first_name} ${payload.last_name}`,
        country_id: payload.country,
        state_id: payload.state,
        city_id: payload.city,
        birthdate: payload.birthdate,
        address: payload.address,
        password: payload.password,
        profile_image: payload.profile_image,
      })
      .eq("id", id);
    if (res.error) {
      this.logger.error(res.error);
    } else if (!res.data && res.error) {
      throw new InternalServerErrorException({
        message: "Something went wrong not your fault",
        status: EResponseStatus.FAILED,
      });
    }
    return res.data;
  }

  async verifyOtpCode(payload: VerifyUserDto) {
    let user: IUser;
    let { data, error } = await this.superBaseService
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
      user = await this.updateEmail(payload);
    } else {
      user = await this.updatePhone(payload);
    }

    await this.superBaseService
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
      message: "Verification successfull",
      status: EResponseStatus.SUCCESS,
      data: {
        user,
        token: token,
      },
    };
  }

  private async updateEmail(payload: VerifyUserDto) {
    let res: any;
    let user: IUser;
    if (payload.email === "horlamidex1@gmail.com") {
      res = await this.superBaseService.connect().from("User").insert({
        email: payload.email,
        email_verified: true,
        active: true,
        enabled: true,
        role: ERole.SUPER_ADMIN,
      });
    } else {
      res = await this.superBaseService.connect().from("User").insert({
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

    res = await this.superBaseService
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
    console.log(user);

    await this.activateAndEnableUser(payload);
    return user;
  }

  private async updatePhone(payload: VerifyUserDto) {
    let res: any;
    let user: IUser;
    if (payload.phone === "+2348095687112") {
      res = await this.superBaseService.connect().from("User").insert({
        phone_number: payload.phone,
        phone_verified: true,
        active: true,
        enabled: true,
        role: ERole.SUPER_ADMIN,
      });
    } else {
      res = await this.superBaseService.connect().from("User").insert({
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

    res = await this.superBaseService
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

  async verifyPhoneOtpCode(payload: VerifyPhoneOtpDto) {
    let { data, error } = await this.superBaseService
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
      res = await this.superBaseService
        .connect()
        .from("User")
        .update({
          phone_number: payload.phone,
          phone_verified: true,
          role: ERole.SUPER_ADMIN,
        })
        .eq("email", payload.email);
    } else {
      res = await this.superBaseService
        .connect()
        .from("User")
        .insert({
          phone_number: payload.phone,
          phone_verified: true,
          role: ERole.USER,
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

    await this.superBaseService
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
    console.log(payload);
    let { data, error } = await this.superBaseService
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
      res = await this.superBaseService
        .connect()
        .from("User")
        .update({
          email: payload.email,
          email_verified: true,
          role: ERole.SUPER_ADMIN,
        })
        .eq("phone_number", payload.phone);
    } else {
      res = await this.superBaseService
        .connect()
        .from("User")
        .update({
          email: payload.email,
          email_verified: true,
          role: ERole.USER,
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

    await this.superBaseService
      .connect()
      .from("verification_code")
      .delete()
      .eq("code", payload.code);
    return {
      message: "Verification successfull",
      status: EResponseStatus.SUCCESS,
    };
  }

  private async activateAndEnableUser(payload: {
    email?: string;
    phone?: string;
    type: "email" | "phone";
  }) {
    let res;

    if (payload.type === "phone") {
      res = await this.superBaseService
        .connect()
        .from("User")
        .select("*")
        .eq("phone_number", payload.phone)
        .single();
    } else {
      res = await this.superBaseService
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
        res = await this.superBaseService
          .connect()
          .from("User")
          .update({
            active: true,
            enabled: true,
          })
          .eq("phone_number", payload.phone);
      } else {
        res = await this.superBaseService
          .connect()
          .from("User")
          .update({
            active: true,
            enabled: true,
          })
          .eq("email", payload.email);
      }
    }
  }
}
