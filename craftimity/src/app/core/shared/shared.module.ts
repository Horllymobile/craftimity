import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SwipperDirective } from '../directives/fm-swipper.directive';

@NgModule({
  declarations: [SwipperDirective],
  imports: [CommonModule, ImageCropperModule],
  exports: [ImageCropperModule, SwipperDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
