import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from "class-validator";

export class ToogleActiveDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  activate: boolean;
}
