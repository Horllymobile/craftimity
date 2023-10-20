import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "src/environments/environment";
import { IState } from "../../models/location";
import { IAPICallResponse, IPaginationResponse } from "../../models/response";

@Injectable({
  providedIn: "root",
})
export class CityService {
  private baseUrl = environment.BASE_URL;
  constructor(private http: HttpClient) {}

  getCities(params?: {
    state?: number;
    page?: number;
    size?: number;
  }): Observable<IState[]> {
    return this.http
      .get<IAPICallResponse<IPaginationResponse<IState>>>(
        `${this.baseUrl}/cities`,
        { params }
      )
      .pipe(map((res) => res.data.data));
  }
}
