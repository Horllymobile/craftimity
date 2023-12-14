import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrdersComponent } from "./orders.component";
import { ComponentsModule } from "../components/components.module";
import { RouterModule, Routes } from "@angular/router";
import { MaterialModule } from "../core/shared/material.module";

const routes: Routes = [
  {
    path: "",
    component: OrdersComponent,
  },
];

@NgModule({
  declarations: [OrdersComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    MaterialModule,
    RouterModule.forChild(routes),
  ],
})
export class OrdersModule {}
