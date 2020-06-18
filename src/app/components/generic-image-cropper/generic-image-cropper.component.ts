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
  isLoading: boolean = true;

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
    // this.showCropper = true;
  }
  cropperReady() {
    // cropper ready
    this.isLoading = false;
  }
  loadImageFailed() {
    // show message
  }

  doneCrop() {
    this.compressImage(this.croppedImage).then(e => {
      this.dialogRef.close({ imageBase64: e });
    })
  }

  compressImage(base64) {
    const canvas = document.createElement('canvas')
    const img = document.createElement('img')
    return new Promise((resolve, reject) => {
      img.onload = function () {
        let width = img.width;
        let height = img.height;
        const maxHeight = 600;
        const maxWidth = 600;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height *= maxWidth / width));
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width *= maxHeight / height));
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      }
      img.onerror = function (err) {
        reject(err);
      }
      img.src = base64;
    })
  }

}
