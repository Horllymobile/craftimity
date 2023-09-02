import { Breakpoints } from "@angular/cdk/layout";
import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { LoginComponent } from "src/app/components/login/login.component";
import { LayoutService } from "src/app/core/services/layout-service/layout.service";

@Component({
  selector: "con-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
  Breakpoints = Breakpoints;
  isMenuOpen = false;
  constructor(
    public layoutService: LayoutService,
    private matDialog: MatDialog,
    private routes: ActivatedRoute,
    private router: Router
  ) {}

  toogleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openModal() {
    if (this.routes.snapshot.url.find((value) => value.path !== "login")) {
      this.matDialog.open(LoginComponent, {
        width: "600px",
        height: "700px",
        closeOnNavigation: true,
        disableClose: true,
      });
      this.toogleMenu();
    } else {
      this.toogleMenu();
    }
  }

  navigateToLogin() {
    this.router.navigate(["/auth/login"]);
  }
}
