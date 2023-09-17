import { IsBoolean, IsNotEmpty } from "class-validator";

export class ToogleActiveDto {
  @IsBoolean()
  @IsNotEmpty()
  activate: boolean;
}
