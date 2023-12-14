import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateArtisan } from '../../models/artisans';
import { IAPIResponse } from '../../models/response';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArtisanService {
  private baseUrl = environment.BASE_URL;
  constructor(private http: HttpClient) {}

  createArtisan(payload: CreateArtisan) {
    return this.http
      .post<IAPIResponse>(`${this.baseUrl}/artisans`, payload)
      .pipe(map((res) => res.message));
  }
}
