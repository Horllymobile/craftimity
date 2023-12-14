import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AccountComponent } from "./account.component";
import { ProfileComponent } from "./profile/profile.component";
import { SharedModule } from "../core/shared/shared.module";
import { MaterialModule } from "../core/shared/material.module";
import { RouterModule, Routes } from "@angular/router";
import { ComponentsModule } from "../components/components.module";

const routes: Routes = [
  {
    path: "",
    component: AccountComponent,
  },
];

@NgModule({
  declarations: [AccountComponent, ProfileComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    SharedModule,
    MaterialModule,
  ],
})
export class AccountModule {}
