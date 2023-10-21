import { Module } from "@nestjs/common";
import { CategoryService } from "./service/category.service";
import { CategoryController } from "./controller/category.controller";
import { SuperbaseService } from "src/core/services/superbase/superbase.service";

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, SuperbaseService],
})
export class CategoryModule {}
