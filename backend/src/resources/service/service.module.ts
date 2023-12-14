import { Module } from "@nestjs/common";
import { ServiceService } from "./service/service.service";
import { ServiceController } from "./controller/service.controller";
import { SchedulerRegistry } from "@nestjs/schedule";
import { SuperbaseService } from "src/core/services/superbase/superbase.service";
import { UserModule } from "../user/user.module";

@Module({
  controllers: [ServiceController],
  providers: [ServiceService, SuperbaseService, SchedulerRegistry],
  imports: [UserModule],
})
export class ServiceModule {}
