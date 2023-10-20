import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../../models/user';
import {
  ILoginResponse,
  ISignIn,
  IUpdateUser,
  IVerifyOtp,
  IVerifyPhoneOtp,
} from '../../models/auth';
import { IAPICallResponse, IAPIResponse } from '../../models/response';
import { JwtHelperService } from '@auth0/angular-jwt';
import { STORAGE_VARIABLES } from '../../constants/storage';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.BASE_URL;
  constructor(
    private http: HttpClient,
    private jwtHelperService: JwtHelperService,
    private router: Router
  ) {}

  isAuthenticated() {
    return !this.jwtHelperService.isTokenExpired(
      localStorage.getItem(STORAGE_VARIABLES.TOKEN)
    );
  }

  signin(payload: ISignIn): Observable<ILoginResponse> {
    return this.http
      .post<IAPICallResponse<ILoginResponse>>(
        `${this.baseUrl}/auth/login`,
        payload
      )
      .pipe(map((res) => res.data));
  }

  signout() {
    localStorage.removeItem(STORAGE_VARIABLES.TOKEN);
    localStorage.removeItem(STORAGE_VARIABLES.USER);
    this.router.navigate(['/auth/login']);
  }

  check(payload: ISignIn): Observable<IUser> {
    return this.http
      .post<IAPICallResponse<IUser>>(`${this.baseUrl}/users/check`, payload)
      .pipe(map((res) => res.data));
  }

  verifyOtp(payload: IVerifyOtp): Observable<IAPICallResponse<IUser>> {
    return this.http
      .patch<IAPICallResponse<IUser>>(`${this.baseUrl}/users/verify`, payload)
      .pipe(map((res) => res));
  }

  verifyPhoneOtp(payload: IVerifyPhoneOtp): Observable<IAPIResponse> {
    return this.http
      .patch<IAPIResponse>(`${this.baseUrl}/users/verify-phone`, payload)
      .pipe(map((res) => res));
  }

  verifyEmailOtp(payload: IVerifyPhoneOtp): Observable<IAPIResponse> {
    return this.http
      .patch<IAPIResponse>(`${this.baseUrl}/users/verify-email`, payload)
      .pipe(map((res) => res));
  }

  resendOTPCode(payload: ISignIn) {
    return this.http
      .patch<IAPIResponse>(`${this.baseUrl}/users/resend-verification`, payload)
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
