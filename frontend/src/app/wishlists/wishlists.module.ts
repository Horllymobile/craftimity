import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WishlistsComponent } from "./wishlists.component";
import { RouterModule, Routes } from "@angular/router";
import { ComponentsModule } from "../components/components.module";
import { SharedModule } from "../core/shared/shared.module";

const routes: Routes = [
  {
    path: "",
    component: WishlistsComponent,
  },
];

@NgModule({
  declarations: [WishlistsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    SharedModule,
  ],
})
export class WishlistsModule {}
