import { Component } from "@angular/core";
import { AuthService } from "./core/services/auth/auth.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "craft-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "Craftimity";
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}
}
