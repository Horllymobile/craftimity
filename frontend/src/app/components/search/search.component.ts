import { Breakpoints } from "@angular/cdk/layout";
import { Component } from "@angular/core";
import { LayoutService } from "src/app/core/services/layout-service/layout.service";

@Component({
  selector: "craft-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent {
  Breakpoints = Breakpoints;
  constructor(public layoutService: LayoutService) {}
}
