import { Module } from "@nestjs/common";
import { CountryService } from "./service/country.service";
import { CountryController } from "./controller/country.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { CountryEntity } from "./entities/country.entity";
import { SuperbaseService } from "src/core/services/superbase/superbase.service";

@Module({
  imports: [SequelizeModule.forFeature([CountryEntity])],
  controllers: [CountryController],
  providers: [CountryService, SuperbaseService],
})
export class CountryModule {}
