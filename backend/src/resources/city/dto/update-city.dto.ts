import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class UpdateCityDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
