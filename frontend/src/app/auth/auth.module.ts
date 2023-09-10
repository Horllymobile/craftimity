import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { ComponentsModule } from "../components/components.module";
import { MaterialModule } from "../core/shared/material.module";
import { SharedModule } from "../core/shared/shared.module";
import { LoginPageComponent } from "./login-page/login-page.component";

const routes: Routes = [
  {
    path: "login",
    component: LoginPageComponent,
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
];

@NgModule({
  declarations: [LoginPageComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(routes),
    MaterialModule,
    SharedModule,
  ],
})
export class AuthModule {}
