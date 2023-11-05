import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { CountryModule } from "./resources/country/country.module";
import { StateModule } from "./resources/state/state.module";
import { CityModule } from "./resources/city/city.module";
import { SuperbaseService } from "./core/services/superbase/superbase.service";
import { ThrottlerModule } from "@nestjs/throttler";
import { UserModule } from "./resources/user/user.module";
import { AuthModule } from "./resources/auth/auth.module";
import { CategoryModule } from "./resources/category/category.module";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./resources/auth/constants/constants";
// import { APP_GUARD } from "@nestjs/core";
// import { AuthGuard } from "./core/guards/auth.guard";
import { CraftsmenModule } from "./resources/craftsmen/craftsmen.module";
import { HttpModule } from "@nestjs/axios";
import { MailModule } from "./mail/mail.module";
import { ScheduleModule } from "@nestjs/schedule";
import { TasksService } from "./core/services/tasks.service";
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "60m" },
    }),
    ScheduleModule.forRoot(),
    CityModule,
    StateModule,
    CountryModule,
    UserModule,
    AuthModule,
    CategoryModule,
    CraftsmenModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SuperbaseService,
    TasksService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
})
export class AppModule {}
