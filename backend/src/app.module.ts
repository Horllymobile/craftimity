import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { CountryModule } from "./resources/country/country.module";
import { StateModule } from "./resources/state/state.module";
import { CityModule } from "./resources/city/city.module";
import { SuperbaseService } from "./core/services/superbase/superbase.service";
import { ThrottlerModule } from "@nestjs/throttler";
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    CityModule,
    StateModule,
    CountryModule,
  ],
  controllers: [AppController],
  providers: [AppService, SuperbaseService],
})
export class AppModule {}
