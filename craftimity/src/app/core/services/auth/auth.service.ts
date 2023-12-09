import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../../models/user';
import {
  IForgotPassword,
  ILoginResponse,
  IRegister,
  ISignIn,
  IVerifyOtp,
  IVerifyPhoneOtp,
} from '../../models/auth';
import { IAPICallResponse, IAPIResponse } from '../../models/response';
import { JwtHelperService } from '@auth0/angular-jwt';
import { STORAGE_VARIABLES } from '../../constants/storage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.BASE_URL;
  isAuth = signal(false);
  headers = new HttpHeaders();
  constructor(
    private http: HttpClient,
    private jwtHelperService: JwtHelperService
  ) {}

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
      .pipe(map((res) => res.data));
  }

  signin(payload: ISignIn): Observable<ILoginResponse> {
    return this.http
      .post<IAPICallResponse<ILoginResponse>>(
        `${this.baseUrl}/auth/login`,
        payload
      )
      .pipe(map((res) => res.data));
  }

  registerCraftsman(payload: { email: string; password: string }) {
    return this.http
      .post<IAPICallResponse<IUser>>(
        `${this.baseUrl}/auth/register-craftman`,
        payload
      )
      .pipe(map((res) => res.data));
  }

  verifyOtp(payload: IVerifyOtp): Observable<{ user: IUser; token: string }> {
    return this.http
      .post<IAPICallResponse<{ user: IUser; token: string }>>(
        `${this.baseUrl}/auth/verify`,
        payload
      )
      .pipe(map((res) => res.data));
  }

  verifyCraftman(payload: IVerifyOtp) {
    return this.http
      .post<IAPICallResponse<{ user: IUser; token: string }>>(
        `${this.baseUrl}/auth/verify-craftman`,
        payload
      )
      .pipe(map((res) => res.data));
  }

  verifyForgotPasswordOtp(
    payload: IVerifyOtp
  ): Observable<{ user: IUser; token: string }> {
    return this.http
      .post<IAPICallResponse<{ user: IUser; token: string }>>(
        `${this.baseUrl}/auth/verify-reset-password`,
        payload
      )
      .pipe(map((res) => res.data));
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

  forgotPassword(payload: IForgotPassword) {
    return this.http
      .post<IAPICallResponse<any>>(
        `${this.baseUrl}/auth/forgot-password`,
        payload
      )
      .pipe(map((res) => res));
  }

  resendOTPCode(payload: ISignIn) {
    return this.http
      .patch<IAPIResponse>(`${this.baseUrl}/auth/resend-verification`, payload)
      .pipe(map((res) => res.message));
  }
}
