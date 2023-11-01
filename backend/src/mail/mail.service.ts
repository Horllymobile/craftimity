import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class MailService {
  logger = new Logger(MailService.name);
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(email: string, code: string) {
    this.logger.log(`Email sent to ${email}`);
    return await this.mailerService.sendMail({
      to: email,
      from: '"Support Team" <support@craftimity.com>',
      subject: "Welcome to Craftimity! Verify your Email",
      template: "./verification",
      context: {
        code,
      },
    });
  }

  async sendForgotPasswordCode(email: string, code: string) {
    this.logger.log(`Email sent to ${email}`);
    return await this.mailerService.sendMail({
      to: email,
      from: '"Support Team" <support@craftimity.com>',
      subject: "Reset Password OTP code",
      template: "./forgot",
      context: {
        code,
      },
    });
  }

  async sendWelcomingMessage(email: string, full_name: string) {
    this.logger.log(`Email sent to ${email}`);
    return await this.mailerService.sendMail({
      to: email,
      from: '"Support Team" <info@craftimity.com>',
      subject: "Welcome to Craftimity - Let's Get Crafty Together!",
      template: "./onboarded",
      context: {
        full_name,
      },
    });
  }
}
