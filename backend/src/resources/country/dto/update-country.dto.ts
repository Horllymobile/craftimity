import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class UpdateCountryDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @Length(2, 3)
  code: string;

  @ApiProperty()
  @IsString()
  @Length(1, 3)
  phoneCode: string;

  @ApiProperty()
  @IsString()
  currency: string;

  @ApiProperty()
  @IsString()
  @Length(2, 3)
  currencyCode: string;
}
