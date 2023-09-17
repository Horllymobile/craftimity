import { Module } from "@nestjs/common";
import { CountryService } from "./service/country.service";
import { CountryController } from "./controller/country.controller";
import { SuperbaseService } from "src/core/services/superbase/superbase.service";

@Module({
  imports: [],
  controllers: [CountryController],
  providers: [CountryService, SuperbaseService],
})
export class CountryModule {}
