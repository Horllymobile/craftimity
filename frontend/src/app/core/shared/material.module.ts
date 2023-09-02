import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { MatDialogModule } from "@angular/material/dialog";
import { CdkMenuModule } from "@angular/cdk/menu";
import { LayoutModule } from "@angular/cdk/layout";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatMenuModule,
    LayoutModule,
    CdkMenuModule,
    MatDividerModule,
    MatDialogModule,
  ],
  exports: [
    MatMenuModule,
    LayoutModule,
    CdkMenuModule,
    MatDividerModule,
    MatDialogModule,
  ],
})
export class MaterialModule {}
