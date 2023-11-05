import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
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

export class UpdateCraftmanDto {
  @IsString()
  @IsOptional()
  first_name: string;

  @IsString()
  @IsOptional()
  last_name: string;

  @IsString()
  @IsOptional()
  service_name: string;

  @IsString()
  @IsOptional()
  business_name: string;

  @IsOptional()
  @IsPhoneNumber("NG")
  phone_number: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  birthdate: string;

  @IsNumber()
  @IsOptional()
  service_category: number;

  @IsNumber()
  @IsOptional()
  country: number;

  @IsNumber()
  @IsOptional()
  state: number;

  @IsNumber()
  @IsOptional()
  city: number;
}
