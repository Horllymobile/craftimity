import { Module } from "@nestjs/common";
import { CountryService } from "./service/country.service";
import { CountryController } from "./controller/country.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { CountryEntity } from "./entities/country.entity";

@Module({
  imports: [SequelizeModule.forFeature([CountryEntity])],
  controllers: [CountryController],
  providers: [CountryService],
})
export class CountryModule {}
