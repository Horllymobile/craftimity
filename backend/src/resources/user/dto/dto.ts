import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateImage {
  @IsString()
  @IsNotEmpty()
  profile_image: string;
}

export class CreateUserAddressDto {
  @IsNumber()
  @IsOptional()
  floor: number;

  @IsNumber()
  @IsOptional()
  house: number;

  @IsString()
  @IsOptional()
  street: string;

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

export class UpdateUserAddressDto {
  @IsString()
  @IsOptional()
  user_id: string;

  @IsNumber()
  @IsOptional()
  floor: number;

  @IsNumber()
  @IsOptional()
  house: number;

  @IsString()
  @IsOptional()
  street: string;

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
