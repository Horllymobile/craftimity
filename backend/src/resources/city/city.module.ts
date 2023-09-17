import { Module } from "@nestjs/common";
import { CityService } from "./service/city.service";
import { CityController } from "./controller/city.controller";
import { SuperbaseService } from "src/core/services/superbase/superbase.service";

@Module({
  imports: [],
  controllers: [CityController],
  providers: [CityService, SuperbaseService],
})
export class CityModule {}
