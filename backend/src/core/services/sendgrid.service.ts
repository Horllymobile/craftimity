import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailService } from "@sendgrid/mail";
import { EmailMessage, EmailTemplate } from "src/core/models/email-template";

@Injectable()
export class SendgridService {
  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
    private mailService: MailService
  ) {
    this.mailService.setApiKey(configService.get("SENDGRID_APIKEY"));
  }

  async sendEmail(msg: EmailMessage) {
    return await this.mailService.send(msg);
  }

  sendEmailDynamic(data: EmailTemplate) {
    return this.httpService.post(
      "https://api.sendgrid.com/v3/mail/send",
      data,
      {
        headers: {
          Authorization: `Bearer ${this.configService.get("SENDGRID_APIKEY")}`,
          "Content-Type": "application/json",
        },
      }
    );
  }
}
