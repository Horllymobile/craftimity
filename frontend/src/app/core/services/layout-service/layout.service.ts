import { Injectable, OnDestroy } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Subject, takeUntil } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LayoutService implements OnDestroy {
  destroyed = new Subject<void>();
  currentScreenSize!: string;

  displayNameMap = new Map([
    [Breakpoints.XSmall, "XSmall"],
    [Breakpoints.Small, "Small"],
    [Breakpoints.Medium, "Medium"],
    [Breakpoints.Large, "Large"],
    [Breakpoints.XLarge, "XLarge"],
  ]);

  constructor(breakpointObserver: BreakpointObserver) {
    breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe((result) => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize =
              this.displayNameMap.get(query) ?? "Unknown";
          }
        }
      });
  }

  get currentScreen() {
    return this.currentScreenSize;
  }

  checkScreenSize(breakPoint: any) {
    return this.currentScreenSize === breakPoint;
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
