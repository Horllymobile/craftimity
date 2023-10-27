import { IsOptional, IsNotEmpty, IsString, IsNumber } from "class-validator";

export class CrateCrafmanDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  business_name: string;

  @IsNotEmpty()
  @IsNumber()
  category: number;
}
