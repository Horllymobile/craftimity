import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommingSoonComponent } from "./comming-soon/comming-soon.component";

const routes: Routes = [
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
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
    path: "comming-soon",
    component: CommingSoonComponent,
  },
  {
    path: "",
    redirectTo: "comming-soon",
    pathMatch: "full",
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
