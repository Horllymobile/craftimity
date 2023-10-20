import { Injectable } from '@angular/core';
import { ICity, ICountry, IState } from '../../models/location';
import { Observable, map } from 'rxjs';
import { IAPICallResponse, IPaginationResponse } from '../../models/response';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private baseUrl = environment.BASE_URL;
  constructor(private http: HttpClient) {}

  getCountries(params?: {
    page: number;
    size: number;
  }): Observable<ICountry[]> {
    return this.http
      .get<IAPICallResponse<IPaginationResponse<ICountry>>>(
        `${this.baseUrl}/countries`,
        { params }
      )
      .pipe(map((res) => res.data.data));
  }

  getStates(params?: {
    country?: number;
    page?: number;
    size?: number;
  }): Observable<IState[]> {
    return this.http
      .get<IAPICallResponse<IPaginationResponse<IState>>>(
        `${this.baseUrl}/states`,
        { params }
      )
      .pipe(map((res) => res.data.data));
  }

  getCities(params?: {
    state?: number;
    page?: number;
    size?: number;
  }): Observable<ICity[]> {
    return this.http
      .get<IAPICallResponse<IPaginationResponse<ICity>>>(
        `${this.baseUrl}/cities`,
        { params }
      )
      .pipe(map((res) => res.data.data));
  }
}
