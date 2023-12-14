import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatTabsModule } from "@angular/material/tabs";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatListModule } from "@angular/material/list";
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
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatDatepickerModule,
    MatMenuModule,
    MatTabsModule,
    MatListModule,
  ],
  exports: [
    MatMenuModule,
    LayoutModule,
    CdkMenuModule,
    MatDividerModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatDatepickerModule,
    MatTabsModule,
    MatListModule,
  ],
})
export class MaterialModule {}
