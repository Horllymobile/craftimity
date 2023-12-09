import { Breakpoints } from "@angular/cdk/layout";
import { Component } from "@angular/core";
import { LayoutService } from "../core/services/layout-service/layout.service";

@Component({
  selector: "craft-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"],
})
export class AccountComponent {
  Breakpoints = Breakpoints;
  constructor(public layoutService: LayoutService) {}
}
