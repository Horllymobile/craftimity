import { IsNotEmpty, IsString } from "class-validator";

export class UpdateImage {
  @IsString()
  @IsNotEmpty()
  profile_image: string;
}
