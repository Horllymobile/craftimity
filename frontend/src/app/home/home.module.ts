import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home.component";
import { ComponentsModule } from "../components/components.module";
import { SharedModule } from "../core/shared/shared.module";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
];

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
})
export class HomeModule {}
