import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";
import { ConfigModule, ConfigService, getConfigToken } from "@nestjs/config";

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get("EMAIL_HOST"),
          // host: "smtp.gmail.com",
          // secure: true,
          port: 2525,
          auth: {
            user: configService.get("EMAIL_USER"),
            pass: configService.get("EMAIL_PASSWORD"),
          },
        },
        defaults: {
          // from: '"No Reply" <noreply@craftimity.com>',
        },
        template: {
          dir: join(__dirname, "templates"),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
