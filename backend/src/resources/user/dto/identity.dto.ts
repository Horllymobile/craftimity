import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateUserIdentity {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsUrl()
  live_image: string;

  @IsNotEmpty()
  @IsUrl()
  residential_address: string;

  @IsNotEmpty()
  @IsUrl()
  identity: string;

  @IsNotEmpty()
  @IsUrl()
  user_id: string;
}
