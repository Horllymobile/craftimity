import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavbarComponent } from "./navbar/navbar.component";
import { SharedModule } from "../core/shared/shared.module";
import { MaterialModule } from "../core/shared/material.module";
import { LoginComponent } from "./login/login.component";

@NgModule({
  declarations: [NavbarComponent, LoginComponent],
  imports: [CommonModule, SharedModule, MaterialModule],
  exports: [NavbarComponent],
})
export class ComponentsModule {}
