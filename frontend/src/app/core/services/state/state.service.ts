import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ICountry, IState } from "../../models/location";
import { Observable, map } from "rxjs";
import { IAPICallResponse, IPaginationResponse } from "../../models/response";

@Injectable({
  providedIn: "root",
})
export class StateService {
  private baseUrl = environment.BASE_URL;
  constructor(private http: HttpClient) {}

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
}
