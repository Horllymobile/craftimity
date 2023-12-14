import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
} from "class-validator";

export class LoginDto {
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsPhoneNumber("NG")
  phone?: string;

  @Length(8, 16)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password: string;

  @IsString()
  @IsNotEmpty()
  type: "email" | "phone";

  @IsBoolean()
  @IsOptional()
  remember?: boolean;
}
