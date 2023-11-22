import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUser } from '../../models/user';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { STORAGE_VARIABLES } from '../../constants/storage';
import { IAPICallResponse, IAPIResponse } from '../../models/response';
import { IUpdateUser } from '../../models/auth';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl = environment.BASE_URL;
  currentUser!: BehaviorSubject<IUser>;
  constructor(private http: HttpClient) {
    this.currentUser = new BehaviorSubject(
      JSON.parse(
        localStorage.getItem(STORAGE_VARIABLES.USER) || 'null'
      ) as IUser
    );
  }

  get userProfile() {
    return this.currentUser.value;
  }

  getUserById(id: string): Observable<IUser> {
    return this.http
      .get<IAPICallResponse<IUser>>(`${this.baseUrl}/users/${id}`)
      .pipe(map((res) => res.data));
  }

  updateImageUrl(id: string, payload: { profile_image: string }) {
    return this.http
      .put<IAPIResponse>(`${this.baseUrl}/users/${id}`, payload)
      .pipe(map((res) => res.message));
  }

  updateUser(id: string, payload: IUpdateUser): Observable<any> {
    return this.http
      .put<IAPIResponse>(`${this.baseUrl}/users/${id}`, payload)
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
