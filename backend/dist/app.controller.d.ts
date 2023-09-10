import { AppService } from "./app.service";
import { IApp } from "./core/interfaces/IApp";
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getApp(): IApp;
}
