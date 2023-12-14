import { Injectable, effect, signal } from "@angular/core";
import {
  ISignIn,
  IUpdateUser,
  IVerifyOtp,
  IVerifyPhoneOtp,
} from "../../models/auth";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable, map } from "rxjs";
import { IRegister, IUser } from "../../models/user";
import { IAPICallResponse, IAPIResponse } from "../../models/response";
import { JwtHelperService } from "@auth0/angular-jwt";
import { STORAGE_VARIABLES } from "../../constants/storage";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private baseUrl = environment.BASE_URL;
  isAuth = signal<boolean>(false);
  constructor(
    private http: HttpClient,
    private jwtHelperService: JwtHelperService
  ) {
    effect(() => {
      console.log("User is authenticated: ", this.isAuth());
    });
    this.isAuthenticated();
  }

  isAuthenticated() {
    const token = localStorage.getItem(STORAGE_VARIABLES.TOKEN);
    if (token) {
      this.isAuth.set(!this.jwtHelperService.isTokenExpired(token));
    }
    return this.isAuth();
  }

  isAuthenticatedT(token: string) {
    return !this.jwtHelperService.isTokenExpired(token);
  }

  register(payload: IRegister): Observable<IAPIResponse> {
    return this.http
      .post<IAPICallResponse<IAPIResponse>>(
        `${this.baseUrl}/auth/register`,
        payload
      )
      .pipe(map((res) => res));
  }

  sigin(payload: ISignIn): Observable<IAPICallResponse<any>> {
    return this.http
      .post<IAPICallResponse<any>>(`${this.baseUrl}/auth/login`, payload)
      .pipe(map((res) => res));
  }

  logout() {
    localStorage.removeItem(STORAGE_VARIABLES.USER);
    localStorage.removeItem(STORAGE_VARIABLES.TOKEN);
    this.isAuth.update((value) => (value = false));
  }

  verifyOtp(payload: IVerifyOtp): Observable<IAPICallResponse<IUser>> {
    return this.http
      .post<IAPICallResponse<IUser>>(`${this.baseUrl}/auth/verify`, payload)
      .pipe(map((res) => res));
  }

  verifyPhoneOtp(payload: IVerifyPhoneOtp): Observable<IAPIResponse> {
    return this.http
      .patch<IAPIResponse>(`${this.baseUrl}/auth/verify-phone`, payload)
      .pipe(map((res) => res));
  }

  verifyEmailOtp(payload: IVerifyPhoneOtp): Observable<IAPIResponse> {
    return this.http
      .patch<IAPIResponse>(`${this.baseUrl}/auth/verify-email`, payload)
      .pipe(map((res) => res));
  }

  resendOTPCode(payload: ISignIn) {
    return this.http
      .patch<IAPIResponse>(`${this.baseUrl}/auth/resend-verification`, payload)
      .pipe(map((res) => res.message));
  }

  updateImageUrl(id: string, payload: { profile_image: string }) {
    return this.http
      .put<IAPIResponse>(`${this.baseUrl}/users/${id}`, payload)
      .pipe(map((res) => res.message));
  }

  updateUser(id: string, payload: IUpdateUser) {
    return this.http
      .put<IAPIResponse>(`${this.baseUrl}/users/${id}`, payload)
      .pipe(map((res) => res.message));
  }

  getUserById(id: string) {
    return this.http
      .get<IAPICallResponse<IUser>>(`${this.baseUrl}/users/${id}`)
      .pipe(map((res) => res.data));
  }
}
