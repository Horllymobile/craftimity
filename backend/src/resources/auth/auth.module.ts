import { Module } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./controller/auth.controller";
import { UserModule } from "../user/user.module";
import { ConfigModule } from "@nestjs/config";
import { SuperbaseService } from "src/core/services/superbase/superbase.service";
import { ElasticService } from "src/core/services/elastic.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [UserModule, ConfigModule, HttpModule],
  controllers: [AuthController],
  providers: [AuthService, SuperbaseService, ElasticService],
})
export class AuthModule {}
