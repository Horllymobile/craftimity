import {
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
} from "class-validator";

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  first_name: string;

  @IsString()
  @IsOptional()
  last_name: string;

  @IsUrl()
  @IsOptional()
  profile_image: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  birthdate: string;

  @IsNumber()
  @IsOptional()
  country: number;

  @IsPhoneNumber()
  @IsOptional()
  phone: string;

  @IsNumber()
  @IsOptional()
  state: number;

  @IsNumber()
  @IsOptional()
  city: number;

  @Length(8, 16)
  @IsString()
  @IsOptional()
  password: string;
}
