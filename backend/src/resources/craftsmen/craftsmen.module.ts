import { Module } from "@nestjs/common";
import { CraftsmenService } from "./service/craftsmen.service";
import { CraftsmenController } from "./controller/craftsmen.controller";
import { SuperbaseService } from "src/core/services/superbase/superbase.service";

@Module({
  controllers: [CraftsmenController],
  providers: [CraftsmenService, SuperbaseService],
})
export class CraftsmenModule {}
