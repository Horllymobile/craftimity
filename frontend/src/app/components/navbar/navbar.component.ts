import { AuthService } from "src/app/core/services/auth/auth.service";
import { Breakpoints } from "@angular/cdk/layout";
import { Component, ElementRef, Renderer2, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { LoginComponent } from "src/app/components/login/login.component";
import { LayoutService } from "src/app/core/services/layout-service/layout.service";
import { MatMenu } from "@angular/material/menu";

@Component({
  selector: "craft-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
  Breakpoints = Breakpoints;
  isMenuOpen = false;
  isAuth = this.authService.isAuth;
  constructor(
    public layoutService: LayoutService,
    private matDialog: MatDialog,
    private routes: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    private authService: AuthService
  ) {}

  openModal() {
    const login = this.routes.snapshot.url.findIndex(
      (value) => value.path === "login"
    );
    if (login < 0) {
      this.matDialog.open(LoginComponent, {
        width: "600px",
        height: "700px",
        closeOnNavigation: true,
        disableClose: true,
      });
    }
  }

  navigateToLogin() {
    this.router.navigate(["/auth/login"]);
  }

  getCurrentPath(): string {
    // console.log(this.router.getCurrentNavigation());
    return "";
    // return this.routes.snapshot.url[this.routes.snapshot.url.length - 1].path;
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl("/auth/login");
  }
}
