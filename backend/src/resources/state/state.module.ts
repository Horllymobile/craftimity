import { Module } from "@nestjs/common";
import { StateService } from "./state.service";
import { StateController } from "./state.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { StateEntity } from "./entities/state.entity";

@Module({
  imports: [SequelizeModule.forFeature([StateEntity])],
  controllers: [StateController],
  providers: [StateService],
})
export class StateModule {}
