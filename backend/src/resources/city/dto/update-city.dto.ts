import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class UpdateCityDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
