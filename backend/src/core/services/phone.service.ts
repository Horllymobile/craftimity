import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { API_URL } from "../constants/api-url";
import { Observable } from "rxjs";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PhoneMessageService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService
  ) {}

  sendVerificationCode(params: {
    phoneNumber: string;
    verifyCode: string;
  }): Observable<any> {
    return this.httpService.post(
      "",
      {},
      {
        params,
        headers: {
          "X-RapidAPI-Key": this.configService.get("RAPID_APIKEY"),
          "X-RapidAPI-Host": "phonenumbervalidatefree.p.rapidapi.com",
        },
      }
    );
  }
}
