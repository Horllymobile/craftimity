import { Breakpoints } from "@angular/cdk/layout";
import { Component, ElementRef, Renderer2, ViewChild } from "@angular/core";
import { LayoutService } from "src/app/core/services/layout-service/layout.service";

@Component({
  selector: "craft-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent {
  Breakpoints = Breakpoints;
  isMenuOpen = false;
  date = new Date();
  @ViewChild("searchInput") searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild("searchResults") searchResults!: ElementRef<HTMLDivElement>;
  constructor(
    public layoutService: LayoutService,
    private renderer: Renderer2
  ) {}

  open() {
    this.renderer.listen(window, "click", (e: PointerEvent) => {
      if (
        e.target === this.searchInput?.nativeElement ||
        e.target === this.searchResults?.nativeElement
      ) {
        this.isMenuOpen = true;
      } else {
        this.isMenuOpen = false;
      }
    });
  }
}
