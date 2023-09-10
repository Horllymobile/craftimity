import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { IApp } from "./core/interfaces/IApp";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getApp(): IApp {
    return this.appService.getApp();
  }
}
