import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { IUserService } from "src/core/interfaces/services/IUserService";
import { SuperbaseService } from "src/core/services/superbase/superbase.service";
import { USERCHECKTYPE } from "src/core/enums/UserCheckType";
import { EResponseStatus } from "src/core/enums/ResponseStatus";
import { IUser } from "src/core/interfaces/IUser";
import { generateVerifcationCode } from "src/core/utils/verification-code";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import { ERole } from "src/core/enums/Role";
import { JwtService } from "@nestjs/jwt";
import { PhoneMessageService } from "src/core/services/phone.service";
import { ElasticService } from "src/core/services/elastic.service";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CreateUserIdentity } from "../dto/identity.dto";
import { jwtConstants } from "src/resources/auth/constants/constants";
import { UpdateUserAddress } from "../dto/dto";

@Injectable({ scope: Scope.REQUEST })
export class UserService implements IUserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly superBaseService: SuperbaseService,
    private jwtService: JwtService,
    private phoneMessageService: PhoneMessageService,
    private elasticService: ElasticService,
    private schedulerRegistry: SchedulerRegistry
  ) {}

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
        phone_number, active, enabled, email_verified, 
        phone_verified, role, created_at, 
        updated_at, is_onboarded, Address(*), birthdate, profile_image`
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
        phone_number, active, enabled, email_verified, 
        phone_verified, role, created_at, 
        updated_at, Address(*) is_onboarded, birthdate, profile_image`
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
        `
        id,first_name,
        last_name,full_name,
        email,phone_number,
        Address(*),
        active, enabled,
        email_verified, 
        phone_verified, role,
        created_at, updated_at,
        is_onboarded, birthdate,
        profile_image`
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
      phone_number, Address(*), active, enabled, email_verified, 
      phone_verified, role, created_at, 
      updated_at, birthdate, is_onboarded, birthdate, profile_image`
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
      phone_number, Address(*), active, enabled, email_verified, 
      phone_verified, role, created_at, 
      updated_at, birthdate, password, decrypted_password, is_onboarded, birthdate, profile_image`
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
      phone_number, Address(*), active, enabled, email_verified, 
      phone_verified, role, created_at, 
      updated_at, password, is_onboarded, birthdate, profile_image`
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
      phone_number, Address(*), active, enabled, email_verified, 
      phone_verified, role, created_at, 
      updated_at, password, decrypted_password, is_onboarded, birthdate, profile_image`
      )
      .eq("phone_number", phone)
      .single();

    if (error) {
      this.logger.error(error);
    }

    return data;
  }

  async sendVerificationCodeToEmail(email: string) {
    const user = await this.findUserByEmail(email);

    if (user?.email_verified) {
      throw new ConflictException({
        status: EResponseStatus.FAILED,
        message: "Email already verified, proceed to login",
      });
    }

    const code = generateVerifcationCode(6);
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
    // await this.mailService.sendUserConfirmation(email, code);
    if (error) {
      this.logger.error(error);
    }

    const job = this.schedulerRegistry.getCronJob("delete-code");
    job.start();

    let mail = await this.elasticService.sendEmailDynamic({
      Recipients: {
        To: [email],
      },
      Content: {
        From: "support@craftimity.com",
        TemplateName: "VERIFY_EMAIL",
        Subject: "Account Verification",
        Merge: {
          code,
          email_address: "support@craftimity.com",
        },
      },
    });
    if (mail.data) {
      this.logger.log(mail.data);
    }
    return;
  }

  async sendForgotPasswordCodeToEmail(email: string) {
    const code = generateVerifcationCode(6);
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

    const job = this.schedulerRegistry.getCronJob("delete-code");
    job.start();

    let mail = await this.elasticService.sendEmailDynamic({
      Recipients: {
        To: [email],
      },
      Content: {
        From: "support@craftimity.com",
        TemplateName: "RESET_PASSWORD_OTP",
        Subject: "Password Reset Request",
        Merge: {
          email_address: "info@craftimity.com",
          code,
        },
      },
    });
    if (mail.data) {
      this.logger.log(mail.data);
    }
    return;
  }

  async sendForgotPasswordCodeToPhone(phone: string) {
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
    const job = this.schedulerRegistry.getCronJob("delete-code");
    job.start();
    // this.phoneMessageService
    //   .sendVerificationCode({ phoneNumber: phone, verifyCode: code })
    //   .subscribe({
    //     next: (res) => {
    //       console.log(res);
    //     },
    //     error: (err) => {
    //       console.log(err);
    //     },
    //   });
    if (error) {
      this.logger.error(error);
    }
    return;
  }

  async sendVerificationCodeToPhone(phone: string) {
    const user = await this.findUserByPhone(phone);
    if (user) {
      throw new ConflictException({
        status: EResponseStatus.FAILED,
        message: "Phone number already in use",
      });
    }
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
    // const job = this.schedulerRegistry.getCronJob("delete-code");
    // job.start();
    // this.phoneMessageService
    //   .sendVerificationCode({ phoneNumber: phone, verifyCode: code })
    //   .subscribe({
    //     next: (res) => {
    //       console.log(res);
    //     },
    //     error: (err) => {
    //       console.log(err);
    //     },
    //   });
    if (error) {
      this.logger.error(error);
    }
    return;
  }

  async createUser(type: USERCHECKTYPE, payload: CreateUserDto) {
    let user: IUser;
    if (type === USERCHECKTYPE.EMAIL) {
      let res = await this.superBaseService.connect().from("User").insert({
        email: payload.email,
        password: payload.password,
        role: ERole.USER,
      });

      if (res.error) {
        this.logger.error(res.error);
      }

      await this.sendVerificationCodeToEmail(payload.email);
      user = await this.findUserByEmail(payload.email);
    } else {
      let res = await this.superBaseService.connect().from("User").insert({
        phone: payload.phone,
        password: payload.password,
        role: ERole.USER,
      });

      if (res.error) {
        this.logger.error(res.error);
      }

      await this.sendVerificationCodeToPhone(payload.phone);
      user = await this.findUserByPhone(payload.phone);
    }

    const jwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const { password, decrypted_password, ...result } = user;
    return {
      data: result,
      access_token: await this.jwtService.signAsync(jwtPayload, {
        expiresIn: jwtConstants.expiresIn,
      }),
    };
  }

  async updateUser(
    id: string,
    payload: UpdateUserDto
  ): Promise<{ message: string }> {
    let res = await this.superBaseService
      .connect()
      .from("User")
      .select("*")
      .eq("id", id)
      .single();

    if (!res.data)
      throw new NotFoundException({
        message: "User not found",
        status: EResponseStatus.FAILED,
      });

    res = await this.superBaseService
      .connect()
      .from("User")
      .update({
        first_name: payload.first_name ?? res.data.first_name,
        last_name: payload.last_name ?? res.data.last_name,
        full_name:
          this.setFullName(payload.first_name, payload.last_name) ||
          this.setFullName(res.data.first_name, res.data.last_name),
        birthdate: payload.birthdate || payload.birthdate,
        phone_number: payload.phone || payload.phone,
        profile_image: payload.profile_image || res.data.profile_image,
        is_onboarded: res.data.is_onboarded,
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

  setFullName(first: string, last: string) {
    return first && last && `${first} ${last}`;
  }

  async createUserLocation(user_id: string, payload: UpdateUserAddress) {
    let res = await this.superBaseService
      .connect()
      .from("User")
      .select("*")
      .eq("id", user_id)
      .single();

    if (!res.data)
      throw new NotFoundException({
        message: "User not found",
        status: EResponseStatus.FAILED,
      });

    await this.superBaseService
      .connect()
      .from("Address")
      .insert({
        ...payload,
        user: user_id,
      });
  }

  async updatePassword(
    id: string,
    payload: { password: string }
  ): Promise<any> {
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
        password: payload.password,
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

  async getUserIdentityInfo(user_id: string) {
    let { data, error } = await this.superBaseService
      .connect()
      .from("User_Identity")
      .select(`id, type, live_image, residential_address, user_id, identity`)
      .eq("user_id", user_id)
      .single();

    if (error) {
      this.logger.log(error);
    }

    return data;
  }

  async verifyUserIdentityInfo(payload: CreateUserIdentity) {
    const user = await this.findUserById(payload.user_id);
    if (!user) {
      throw new NotFoundException({
        status: EResponseStatus.FAILED,
        message: "User not found",
      });
    }

    let { data, error } = await this.superBaseService
      .connect()
      .from("User_Identity")
      .select(
        `id, type, live_image, residential_address, user_id,
        identity, live_image_approved, residential_approved, identity_approved`
      )
      .eq("user_id", payload.user_id)
      .single();

    if (error) {
      this.logger.error(error);
    }

    if (
      data &&
      data.identity_approved &&
      data.residential_approved &&
      data.live_image_approved
    ) {
      throw new ConflictException({
        status: EResponseStatus.FAILED,
        message: "User Identity already available and as been approved",
      });
    }

    if (data) {
      throw new ConflictException({
        status: EResponseStatus.FAILED,
        message: "User Identity already available",
      });
    }

    await this.superBaseService.connect().from("User_Identity").insert(payload);
  }
}
