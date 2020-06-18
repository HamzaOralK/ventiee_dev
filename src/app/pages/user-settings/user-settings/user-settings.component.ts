import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/dataServices/user/user.service';
import { User } from 'src/app/dtos/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Gender, SchoolType } from 'src/app/dtos/enums';
import { COMMONS } from 'src/app/shared/commons';
import { MatDialog } from '@angular/material/dialog';
import { GenericImageCropperComponent } from 'src/app/components/generic-image-cropper/generic-image-cropper.component';
import { AppService } from 'src/app/app.service';
import { NotificationService, SnackType } from 'src/app/services/notification/notification.service';
import { MultiLanguagePipe } from 'src/app/shared/pipes/multi-language.pipe';

@Component({
  selector: 'user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  user_id:string;
  user: User;
  genders: any;
  schoolTypes: any;
  croppedImage: any = '';
  imageChangedEvent: any = '';
  isLoading: boolean = true;

  profileForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.min(2)]),
    surname: new FormControl('', [Validators.required, Validators.min(2)]),
    emailNotification: new FormControl(false),
    nickname: new FormControl('', [Validators.required, Validators.min(3)]),
    description: new FormControl('', [Validators.max(140)]),
    birthday: new FormControl(),
    gender: new FormControl(),
    preferredGender: new FormControl(),
    schoolType: new FormControl(),
    school: new FormControl(),
    base64: new FormControl()
  });

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private appService: AppService,
    public dialog: MatDialog,
    public notificationService: NotificationService,
    public mlPipe: MultiLanguagePipe
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(p => {
      this.user_id = p.get('id');
      this.userService.getUserById(p.get('id')).subscribe(user => {
        this.user = user;
        this.profileForm.patchValue(this.user);
      });
    });
    this.isLoading = false;
    this.genders = COMMONS.getEnumArray(Gender);
    this.schoolTypes = COMMONS.getEnumArray(SchoolType);
  }

  submit(event) {
    event.preventDefault();
    this.appService.loading = true;
    this.userService.updateUserById(this.user_id, this.profileForm.value).subscribe(p => {
      this.appService.loading = false;
      this.profileForm.controls["base64"].setValue(undefined);
    }, e => {
      this.notificationService.notify(this.mlPipe.transform("updateError"), SnackType.warn);
      this.appService.loading = false;
    });
  }

  uploadImg(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.openImageCropper(reader.result);
    };
  }

  openImageCropper(imageBase64: any) {
    const dialogRef = this.dialog.open(GenericImageCropperComponent, {
      maxWidth: '600px',
      maxHeight: '700px',
      data: {
        croppedImage: this.croppedImage,
        imageBase64: imageBase64,
        aspectRatio: 1
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.imageBase64) {
        this.croppedImage = result.imageBase64;
        this.profileForm.controls["base64"].setValue(this.croppedImage);
      }
    });
  }

  getImage() {
    if(this.croppedImage) {
      return this.croppedImage;
    } else if (this.user.imageURI) {
      return this.user.imageURI;
    } else {
      return './assets/user.png';
    }
  }

}
