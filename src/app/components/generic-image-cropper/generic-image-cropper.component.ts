import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'generic-image-cropper',
  templateUrl: './generic-image-cropper.component.html',
  styleUrls: ['./generic-image-cropper.component.scss']
})
export class GenericImageCropperComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  imageBase64: any;
  aspectRatio: number = 4/3;

  constructor(
    public dialogRef: MatDialogRef<GenericImageCropperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef
  ) {
    this.imageBase64 = this.data.imageBase64;
    this.croppedImage = this.data.croppedImage;
    if (this.data.aspectRatio) {
      this.aspectRatio = this.data.aspectRatio;
    }
  }

  ngOnInit(): void {
    this.cdr.detectChanges();
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  doneCrop() {
    this.dialogRef.close({imageBase64: this.croppedImage});
  }
}
