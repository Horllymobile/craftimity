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
import { CreateUserAddressDto, UpdateUserAddressDto } from "../dto/dto";
import {
  userDecryptedReturnString,
  userReturnString,
} from "src/core/shared/data";
import { EApprovalStatus } from "src/core/enums/approval-status";

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
        .from("user")
        .select("*", { count: "exact", head: true });

    return count;
  }

  async findUsers(page: number, size: number, name?: string): Promise<any[]> {
    page = page <= 1 ? 0 : page;
    let res: any;

    if (name) {
      res = await this.superBaseService
        .connect()
        .from("user")
        .select(userReturnString)
        .ilike("idx_user_name", `%${name}%`)
        .limit(size)
        .order("id", { ascending: true })
        .eq("active", true)
        .range(page, size);
    } else {
      res = await this.superBaseService
        .connect()
        .from("user")
        .select(userReturnString)
        .limit(size)
        .eq("active", true)
        .range(page, size);
    }

    if (res.error) {
      this.logger.error(res.error);
    }
    return res.data;
  }

  async findUserById(id: string): Promise<any> {
    let { data, error } = await this.superBaseService
      .connect()
      .from("user")
      .select(userReturnString)
      .eq("id", id)
      .single();

    if (error) {
      this.logger.error(error);
    }

    return data;
  }

  async findUserByEmail(email: string): Promise<any> {
    let { data, error } = await this.superBaseService
      .connect()
      .from("user")
      .select(userReturnString)
      .eq("email", email)
      .single();

    if (error) {
      this.logger.error(error);
    }

    return data;
  }

  async findUserByEmailDecrypted(email: string): Promise<any> {
    let { data, error } = await this.superBaseService
      .connect()
      .from("decrypted_user")
      .select(userDecryptedReturnString)
      .eq("email", email)
      .single();
    if (error) {
      this.logger.error(error);
    }

    return data;
  }

  async findUserByPhone(phone: string): Promise<any> {
    let { data, error } = await this.superBaseService
      .connect()
      .from("user")
      .select(userReturnString)
      .eq("phone_number", phone)
      .single();

    if (error) {
      this.logger.error(error);
    }

    return data;
  }

  async findUserByPhoneDecrypted(phone: string) {
    let { data, error } = await this.superBaseService
      .connect()
      .from("decrypted_user")
      .select(userDecryptedReturnString)
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
    this.logger.log("Phone OTP code " + code);
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
    this.logger.log("Phone OTP code " + code);
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

  async createUser(payload: CreateUserDto, role?: ERole) {
    let user: any;
    let res: any;

    user = await this.findUserByEmail(payload.email);

    if (user)
      throw new ConflictException({
        status: EResponseStatus.FAILED,
        message: "Email is already taken",
      });

    if (payload.email === "horlamidex1@gmail.com") {
      res = await this.superBaseService
        .connect()
        .from("user")
        .insert({
          first_name: payload.first_name,
          last_name: payload.last_name,
          full_name: this.setFullName(payload.first_name, payload.last_name),
          email: payload.email,
          phone_number: payload.phone,
          password: payload.password,
          role: ERole.SUPER_ADMIN,
        });
    } else if (payload.email === "kogiboi@gmail.com") {
      res = await this.superBaseService
        .connect()
        .from("user")
        .insert({
          first_name: payload.first_name,
          last_name: payload.last_name,
          full_name: this.setFullName(payload.first_name, payload.last_name),
          email: payload.email,
          password: payload.password,
          phone_number: payload.phone,
          role: ERole.ADMIN,
        });
    } else {
      res = await this.superBaseService
        .connect()
        .from("user")
        .insert({
          first_name: payload.first_name,
          last_name: payload.last_name,
          full_name: this.setFullName(payload.first_name, payload.last_name),
          email: payload.email,
          password: payload.password,
          phone_number: payload.phone,
          role: role ? role : ERole.USER,
        });
    }

    if (res.error) {
      this.logger.log(res.error);
    }

    await this.sendVerificationCodeToEmail(payload.email);
  }

  async updateUser(
    id: string,
    payload: UpdateUserDto
  ): Promise<{ message: string }> {
    let res = await this.superBaseService
      .connect()
      .from("user")
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
      .from("user")
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
        updated_at: new Date().toISOString(),
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

  async createUserLocation(
    user_id: string,
    payload: CreateUserAddressDto,
    user?: any
  ) {
    let res = await this.superBaseService
      .connect()
      .from("user")
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
      .from("address")
      .insert({
        ...payload,
        user: user_id,
        created_by: user.sub,
      });
  }

  async updateUserLocation(
    address_id: string,
    payload: UpdateUserAddressDto,
    user?: any
  ) {
    let res = await this.superBaseService
      .connect()
      .from("user")
      .select("*")
      .eq("id", payload.user_id)
      .single();

    if (!res.data)
      throw new NotFoundException({
        message: "User not found",
        status: EResponseStatus.FAILED,
      });

    res = await this.superBaseService
      .connect()
      .from("address")
      .select("*")
      .eq("id", address_id)
      .single();

    if (!res.data)
      throw new NotFoundException({
        message: "Address not found",
        status: EResponseStatus.FAILED,
      });

    res = await this.superBaseService
      .connect()
      .from("address")
      .update({
        floor: payload.floor || res.data.floor,
        user: payload.user_id,
        house: payload.house,
        street: payload.street,
        country: payload.country,
        state: payload.state,
        city: payload.city,
        updated_at: new Date().toISOString(),
        updated_by: user.sub,
      })
      .eq("id", address_id);

    if (res.error) {
      this.logger.log(res.error);
    }
  }

  async deleteUserLocation(address_id: string, user?: any) {
    let res = await this.superBaseService
      .connect()
      .from("address")
      .select("*")
      .eq("id", address_id)
      .single();

    if (!res.data)
      throw new NotFoundException({
        message: "Address not found",
        status: EResponseStatus.FAILED,
      });

    res = await this.superBaseService
      .connect()
      .from("address")
      .delete()
      .eq("id", address_id);

    if (res.error) {
      this.logger.log(res.error);
    }
  }

  async updatePassword(
    id: string,
    payload: { password: string }
  ): Promise<any> {
    let { data, error } = await this.superBaseService
      .connect()
      .from("user")
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
      .from("user")
      .update({
        password: payload.password,
        updated_at: new Date().toISOString(),
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
      .from("identity")
      .select(`id, type, live_image, residential_address, identity`)
      .eq("id", user_id)
      .single();

    if (error) {
      this.logger.log(error);
    }

    return data;
  }

  async verifyUserIdentityInfo(payload: CreateUserIdentity) {
    const user = await this.findUserById(payload.id);
    if (!user) {
      throw new NotFoundException({
        status: EResponseStatus.FAILED,
        message: "User not found",
      });
    }

    let { data, error } = await this.superBaseService
      .connect()
      .from("identity")
      .select(
        `id, type, live_image, residential_address,
        identity, live_image_approved, residential_approved, identity_approved`
      )
      .eq("id", payload.id)
      .single();

    if (error) {
      this.logger.error(error);
    }

    if (!data) {
      const res = await this.superBaseService
        .connect()
        .from("identity")
        .insert({
          id: payload.id,
          ...payload,
        });

      if (res.error) {
        this.logger.error(error);
      }
    }

    if (
      data &&
      data.identity_approved === EApprovalStatus.APPROVED &&
      data.residential_approved === EApprovalStatus.APPROVED &&
      data.live_image_approved === EApprovalStatus.APPROVED
    ) {
      throw new ConflictException({
        status: EResponseStatus.FAILED,
        message: "User Identity already available and as been approved",
      });
    } else {
      const res = await this.superBaseService
        .connect()
        .from("identity")
        .update({
          ...payload,
          updated_at: new Date().toISOString(),
        })
        .eq("id", payload.id);

      if (res.error) {
        this.logger.log(res.error);
      }
    }
  }

  async sendWelcomingEmail(user: IUser) {
    let mail = await this.elasticService.sendEmailDynamic({
      Recipients: {
        To: [user.email],
      },
      Content: {
        From: "info@craftimity.com",
        TemplateName: "WELCOMING_EMAIL",
        Subject:
          "Welcome to craftimty: Congratulations on successfully onboarding with us! ",
        Merge: {
          full_name: user.full_name,
          email_address: "info@craftimity.com",
        },
      },
    });
    this.logger.log(mail.data);
  }
}
