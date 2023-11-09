import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUser } from '../../models/user';
import { BehaviorSubject } from 'rxjs';
import { STORAGE_VARIABLES } from '../../constants/storage';

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
}
