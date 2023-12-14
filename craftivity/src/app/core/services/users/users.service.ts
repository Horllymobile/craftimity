import { AuthService } from 'src/app/core/services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable, effect, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IAddress, IUser } from '../../models/user';
import { STORAGE_VARIABLES } from '../../constants/storage';
import { IAPICallResponse, IAPIResponse } from '../../models/response';
import { IUpdateUser } from '../../models/auth';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl = environment.BASE_URL;
  userData = signal<IUser | undefined>(undefined);
  constructor(private http: HttpClient, private authService: AuthService) {}

  getUser() {
    const user = JSON.parse(
      localStorage.getItem(STORAGE_VARIABLES.USER) || 'null'
    );
    if (user) {
      this.userData.update((value) => (value = user));
    }
    return this.userData();
  }

  signout() {
    localStorage.removeItem(STORAGE_VARIABLES.TOKEN);
    localStorage.removeItem(STORAGE_VARIABLES.USER);
    this.userData.update((value) => (value = undefined));
    this.authService.isAuth.update((value) => (value = false));
  }

  getUserById(id?: string): Observable<IUser> {
    return this.http
      .get<IAPICallResponse<IUser>>(`${this.baseUrl}/users/${id}`)
      .pipe(map((res) => res.data));
  }

  updateImageUrl(id: string, payload: { profile_image: string }) {
    return this.http
      .put<IAPIResponse>(`${this.baseUrl}/users/${id}`, payload)
      .pipe(map((res) => res.message));
  }

  updateUser(id?: string, payload?: IUpdateUser): Observable<any> {
    return this.http
      .put<IAPIResponse>(`${this.baseUrl}/users/${id}`, payload)
      .pipe(map((res) => res.message));
  }

  createUserAddress(id?: string, payload?: IAddress): Observable<any> {
    return this.http
      .post<IAPIResponse>(`${this.baseUrl}/users/${id}/address`, payload)
      .pipe(map((res) => res.message));
  }

  updateUserAddress(id: string, payload: IAddress): Observable<any> {
    return this.http
      .put<IAPIResponse>(
        `${this.baseUrl}/users/${payload?.user_id}/address/${id}`,
        payload
      )
      .pipe(map((res) => res.message));
  }

  updateUserIdentity(payload: any): Observable<any> {
    return this.http
      .post<IAPIResponse>(`${this.baseUrl}/users/create-identity`, payload)
      .pipe(map((res) => res.message));
  }

  updatePassword(id: string, payload: { password: string }) {
    const token = localStorage.getItem(STORAGE_VARIABLES.FORGOT_PASSWORD_TOKEN);
    let tok: string = '';
    if (token) {
      tok = `Bearer ${token}`;
    }
    return this.http
      .patch<IAPIResponse>(
        `${this.baseUrl}/users/${id}/update-password`,
        payload,
        {
          headers: { Authorization: tok },
        }
      )
      .pipe(map((res) => res.message));
  }
}
