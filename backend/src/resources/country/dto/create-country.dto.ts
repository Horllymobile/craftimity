import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateCountryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 3)
  code: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 3)
  phoneCode: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 3)
  currencyCode: string;
}
