import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmailTemplate } from "../models/email-template";
import { EmailPayload } from "../models/elastic-email";
import { API_URL } from "../constants/api-url";

@Injectable()
export class ElasticService {
  url = this.configService.get("ELASTICT_EMAIL_API_URL");
  apiKey = this.configService.get("ELASTICT_EMAIL_API_KEY");
  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  sendEmailDynamic(data: EmailPayload) {
    return this.httpService.post(
      `${API_URL.elastic_api}emails/transactional`,
      data,
      {
        params: {
          apikey: this.configService.get("ELASTICT_EMAIL_API_KEY"),
        },
        headers: {
          //   Authorization: `${this.configService.get("ELASTICT_EMAIL_API_KEY")}`,
          "Content-Type": "application/json",
          "Request-Body-Schema": "application/json",
        },
      }
    );
  }
}
