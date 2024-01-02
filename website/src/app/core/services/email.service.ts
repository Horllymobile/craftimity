import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { IAddContact } from '../models/contact';

@Injectable({ providedIn: 'root' })
export class EmailService {
  private url = environment.ELASTICT_EMAIL_API_URL;
  private apiKey = environment.ELASTICT_EMAIL_API_KEY;
  constructor(private readonly httpService: HttpClient) {}

  async addContact(payload: IAddContact) {
    return await this.httpService
      .post(`${this.url}contacts`, payload, {
        params: {
          apikey: this.apiKey,
        },
        headers: {
          'Content-Type': 'application/json',
          'Request-Body-Schema': 'application/json',
        },
      })
      .toPromise();
  }
}
