import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "con-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"],
})
export class LoginPageComponent {
  openLoginWithEmail = true;
  openLoginWithPhone = false;

  constructor(private router: ActivatedRoute) {}

  toogle() {
    console.log(this.router.snapshot.url);
    if (this.router.snapshot.url.find((value) => value.path !== "/login")) {
      this.openLoginWithEmail = !this.openLoginWithEmail;
      this.openLoginWithPhone = !this.openLoginWithPhone;
    }
  }
}
