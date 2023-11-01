import { IsOptional, IsNotEmpty, IsString, IsNumber } from "class-validator";

export class UpdateCrafmanDto {
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
