import { Module } from "@nestjs/common";
import { CraftsmenService } from "./service/craftsmen.service";
import { CraftsmenController } from "./controller/craftsmen.controller";
import { SuperbaseService } from "src/core/services/superbase/superbase.service";
import { UserModule } from "../user/user.module";

@Module({
  controllers: [CraftsmenController],
  providers: [CraftsmenService, SuperbaseService],
  imports: [UserModule],
})
export class CraftsmenModule {}
