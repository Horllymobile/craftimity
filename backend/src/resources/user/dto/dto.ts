import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateImage {
  @IsString()
  @IsNotEmpty()
  profile_image: string;
}

export class UpdateUserAddress {
  @IsString()
  @IsOptional()
  floor: number;

  @IsString()
  @IsOptional()
  house: string;

  @IsString()
  @IsOptional()
  street: string;

  @IsString()
  @IsOptional()
  country: any;

  @IsString()
  @IsOptional()
  state: any;

  @IsString()
  @IsOptional()
  city: any;
}
