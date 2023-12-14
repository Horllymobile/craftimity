import { IsOptional, IsNotEmpty, IsString, IsNumber } from "class-validator";

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
