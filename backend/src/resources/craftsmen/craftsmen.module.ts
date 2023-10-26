import { Module } from "@nestjs/common";
import { CraftsmenService } from "./service/craftsmen.service";
import { CraftsmenController } from "./controller/craftsmen.controller";

@Module({
  controllers: [CraftsmenController],
  providers: [CraftsmenService],
})
export class CraftsmenModule {}
