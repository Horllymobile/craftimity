import { Breakpoints } from "@angular/cdk/layout";
import { Component } from "@angular/core";
import { LayoutService } from "../core/services/layout-service/layout.service";
import { AuthService } from "../core/services/auth/auth.service";

@Component({
  selector: "craft-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
})
export class OrdersComponent {
  Breakpoints = Breakpoints;
  constructor(
    public layoutService: LayoutService,
    private authService: AuthService
  ) {
    console.log(this.authService.isAuth());
  }
}
