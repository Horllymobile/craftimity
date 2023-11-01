import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { ImageCropperModule } from "ngx-image-cropper";

@NgModule({
  declarations: [],
  imports: [CommonModule, ToastrModule.forRoot({}), ImageCropperModule],
  providers: [ToastrService],
  exports: [ToastrModule, ImageCropperModule],
})
export class SharedModule {}
