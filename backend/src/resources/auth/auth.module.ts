import { Module } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./controller/auth.controller";
import { UserModule } from "../user/user.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [UserModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
