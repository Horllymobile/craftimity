import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { IAPICallResponse, IPaginationResponse } from "../../models/response";
import { ICountry } from "../../models/location";
import { Observable, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CountryService {
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
}
