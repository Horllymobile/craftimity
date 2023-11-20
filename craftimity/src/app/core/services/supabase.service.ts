import { createClient } from '@supabase/supabase-js';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SupaBaseService {
  constructor(private http: HttpClient) {}
  supabase = createClient(
    environment.SUPABASE_URL,
    environment.SUPABASE_API_KEY
  );

  uploadFile(file: any, username?: string) {
    const url = `${
      environment.SUPABASE_URL
    }/storage/v1/object/Images/profiles/${
      username
        ? username.toLocaleLowerCase().replace(' ', '-') + '-' + Date.now()
        : `IMG-${Date.now()}`
    }`;
    const req = new HttpRequest('POST', url, file, {
      reportProgress: true,
      headers: new HttpHeaders({
        Authorization: `Bearer ${environment.SUPABASE_API_KEY}`,
      }),
    });

    return this.http.request(req);
  }

  uploadVerificationImage(file: any, username?: string) {
    const url = `${
      environment.SUPABASE_URL
    }/storage/v1/object/Images/verification/${
      username
        ? username.toLocaleLowerCase().replace(' ', '-') + '-' + Date.now()
        : `IMG-${Date.now()}`
    }`;
    const req = new HttpRequest('POST', url, file, {
      reportProgress: true,
      headers: new HttpHeaders({
        Authorization: `Bearer ${environment.SUPABASE_API_KEY}`,
      }),
    });

    return this.http.request(req);
  }
}
