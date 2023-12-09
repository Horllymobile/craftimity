import { AuthService } from "./../services/auth/auth.service";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { UserService } from "src/app/core/services/user/user.service";
import { environment } from "src/environments/environment";
import { STORAGE_VARIABLES } from "../constants/storage";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const reg = localStorage.getItem(STORAGE_VARIABLES.REGISTERATION_TOKEN);

    const token = localStorage.getItem(STORAGE_VARIABLES.TOKEN);

    const userData = this.userService.userProfile;

    const isBaseUrl = req.url.startsWith(environment.BASE_URL);

    if (token && userData && this.authService.isAuthenticated() && isBaseUrl) {
      req = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${token}`),
      });
    }

    if (reg && userData && this.authService.isAuthenticated() && isBaseUrl) {
      req = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${reg}`),
      });
    }

    return next.handle(req);
  }
}
