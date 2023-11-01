import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CrateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  icon: string;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  is_active: boolean;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  icon: string;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  is_active: boolean;
}
