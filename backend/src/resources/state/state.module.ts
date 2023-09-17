import { Module } from "@nestjs/common";
import { StateService } from "./service/state.service";
import { StateController } from "./controller/state.controller";
import { SuperbaseService } from "src/core/services/superbase/superbase.service";

@Module({
  imports: [],
  controllers: [StateController],
  providers: [StateService, SuperbaseService],
})
export class StateModule {}
