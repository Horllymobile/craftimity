import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
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
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    MatMenuModule,
    LayoutModule,
    CdkMenuModule,
    MatDividerModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class MaterialModule {}
