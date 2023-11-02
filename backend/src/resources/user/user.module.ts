import { Module } from "@nestjs/common";
import { UserService } from "./service/user.service";
import { UserController } from "./controller/user.controller";
import { SuperbaseService } from "src/core/services/superbase/superbase.service";
import { SendgridService } from "src/core/services/sendgrid.service";
import { HttpModule } from "@nestjs/axios";
import { MailService } from "@sendgrid/mail";
import { PhoneMessageService } from "src/core/services/phone.service";
import { MailModule } from "src/mail/mail.module";
import { ElasticService } from "src/core/services/elastic.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    MailModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    SuperbaseService,
    SendgridService,
    MailService,
    PhoneMessageService,
    ElasticService,
  ],
  exports: [UserService],
})
export class UserModule {}
