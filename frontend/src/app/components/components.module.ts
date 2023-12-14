import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavbarComponent } from "./navbar/navbar.component";
import { SharedModule } from "../core/shared/shared.module";
import { MaterialModule } from "../core/shared/material.module";
import { LoginComponent } from "./login/login.component";
import { RouterModule } from "@angular/router";
import { SearchComponent } from "./search/search.component";

@NgModule({
  declarations: [NavbarComponent, LoginComponent, SearchComponent],
  imports: [CommonModule, SharedModule, MaterialModule, RouterModule],
  exports: [NavbarComponent, LoginComponent, SearchComponent],
})
export class ComponentsModule {}
