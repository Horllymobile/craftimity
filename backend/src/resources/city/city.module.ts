import { Module } from "@nestjs/common";
import { CityService } from "./city.service";
import { CityController } from "./city.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { CityEntity } from "./entities/city.entity";

@Module({
  imports: [SequelizeModule.forFeature([CityEntity])],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
