import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from "class-validator";

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
