import { Breakpoints } from "@angular/cdk/layout";
import { Component } from "@angular/core";
import { LayoutService } from "../core/services/layout-service/layout.service";

@Component({
  selector: "craft-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
  Breakpoints = Breakpoints;
  constructor(public layoutService: LayoutService) {}
}
