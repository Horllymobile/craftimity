import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from "class-validator";
import { USERCHECKTYPE } from "src/core/enums/UserCheckType";

export class UserCheckDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsEnum(USERCHECKTYPE)
  @IsNotEmpty()
  type: USERCHECKTYPE;

  @IsOptional()
  @IsPhoneNumber("NG")
  phone?: string;
}
