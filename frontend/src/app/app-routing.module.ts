import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommingSoonComponent } from "./comming-soon/comming-soon.component";
import { SessionGuard } from "./core/guards/session.guard";
import { AuthGuard } from "./core/guards/auth.guard";
import { NotFoundComponent } from "./not-found/not-found.component";

const routes: Routes = [
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
    canActivate: [SessionGuard],
  },
  {
    path: "wishlists",
    loadChildren: () =>
      import("./wishlists/wishlists.module").then((m) => m.WishlistsModule),
  },
  {
    path: "home",
    loadChildren: () => import("./home/home.module").then((m) => m.HomeModule),
  },
  {
    path: "account",
    loadChildren: () =>
      import("./account/account.module").then((m) => m.AccountModule),
    canActivate: [AuthGuard],
  },
  {
    path: "orders",
    loadChildren: () =>
      import("./orders/orders.module").then((m) => m.OrdersModule),
    canActivate: [AuthGuard],
  },
  {
    path: "comming-soon",
    component: CommingSoonComponent,
  },
  {
    path: "",
    redirectTo: "comming-soon",
    pathMatch: "full",
  },
  {
    path: "**",
    component: NotFoundComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: "enabledBlocking",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
