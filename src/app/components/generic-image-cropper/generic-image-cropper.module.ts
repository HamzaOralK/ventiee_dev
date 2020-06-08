import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { ImageCropperModule } from 'ngx-image-cropper';
import { GenericImageCropperComponent } from './generic-image-cropper.component';


@NgModule({
  declarations: [
    GenericImageCropperComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    DirectivesModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ImageCropperModule
  ],
  exports: [
    GenericImageCropperComponent
  ],
  entryComponents: [GenericImageCropperComponent]
})

export class GenericImageCropperModule { }
