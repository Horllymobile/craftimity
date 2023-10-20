import { Module } from "@nestjs/common";
import { UserService } from "./service/user.service";
import { UserController } from "./controller/user.controller";
import { SuperbaseService } from "src/core/services/superbase/superbase.service";

@Module({
  controllers: [UserController],
  providers: [UserService, SuperbaseService],
  exports: [UserService],
})
export class UserModule {}
