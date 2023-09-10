import { ConfigService } from "@nestjs/config";
import { IApp } from "./core/interfaces/IApp";
export declare class AppService {
    private configService;
    constructor(configService: ConfigService);
    getApp(): IApp;
}
