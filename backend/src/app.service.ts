import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IApp } from "./core/interfaces/IApp";

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getApp(): IApp {
    return {
      name: this.configService.get("NAME"),
      status: "OKAY",
      version: Number(this.configService.get("VERSION")),
      environment: this.configService.get("ENV"),
    };
  }
}
