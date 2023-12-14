import {
  IsOptional,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUrl,
} from "class-validator";

export class CrateCrafmanDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  business_name: string;

  @IsNotEmpty()
  @IsNumber()
  category: number;

  @IsUrl()
  @IsOptional()
  certificate: string;

  @IsUrl()
  @IsOptional()
  work_id: string;
}
