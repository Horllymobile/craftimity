import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateUserIdentity {
  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @IsUrl()
  live_image: string;

  @IsOptional()
  @IsUrl()
  residential_address: string;

  @IsOptional()
  @IsUrl()
  identity: string;

  @IsNotEmpty()
  @IsString()
  id: string;
}
