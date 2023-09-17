import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateCountryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 3)
  code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 4)
  phoneCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 3)
  currencyCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 3)
  currencySymbol: string;
}
