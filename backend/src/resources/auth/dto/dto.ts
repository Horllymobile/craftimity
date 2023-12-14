import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
} from "class-validator";
import { USERCHECKTYPE } from "src/core/enums/UserCheckType";

export class VerifyCraftmanDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @Length(6, 6)
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsPhoneNumber("NG")
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  type: "email" | "phone";
}

export class UpdateCraft {
  @IsString()
  @IsNotEmpty()
  service_name: string;

  @IsString()
  @IsNotEmpty()
  business_name: string;

  @IsNumber()
  @IsNotEmpty()
  service_category: number;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber("NG")
  phone?: string;

  @IsOptional()
  @IsBoolean()
  is_artisan?: boolean;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserCheckDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsEnum(USERCHECKTYPE)
  @IsNotEmpty()
  type: USERCHECKTYPE;

  @IsOptional()
  @IsPhoneNumber("NG")
  phone?: string;
}

export class VerifyUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @Length(6, 6)
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsPhoneNumber("NG")
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  type: "email" | "phone";
}

export class VerifyPhoneOtpDto {
  @IsEmail()
  email?: string;

  @Length(6, 6)
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsPhoneNumber("NG")
  phone?: string;
}

export class SendOTPDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsPhoneNumber("NG")
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  type: "email" | "phone";
}
