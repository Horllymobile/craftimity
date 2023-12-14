import { Injectable, Signal, signal } from "@angular/core";
import { IUser } from "../../models/user";
import { STORAGE_VARIABLES } from "../../constants/storage";

@Injectable({
  providedIn: "root",
})
export class UserService {
  currentUser = signal<IUser | null>(null);

  constructor() {
    this.currentUser.set(
      JSON.parse(
        localStorage.getItem(STORAGE_VARIABLES.USER) || "null"
      ) as IUser
    );
  }

  get userProfile() {
    return this.currentUser();
  }

  getUser() {
    return this.currentUser();
  }
}
