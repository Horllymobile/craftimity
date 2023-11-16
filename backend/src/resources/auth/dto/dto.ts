import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
} from "class-validator";

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

export class RegisterCraftmanDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
