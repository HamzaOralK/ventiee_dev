import { Component, OnInit, Inject, Injector } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/dtos/user';
import { RoomService } from 'src/app/services/dataServices/room/room.service';
import { Room, RoomUser } from 'src/app/dtos/room';
import * as fromRoom from '../../services/dataServices/room/store/room.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import { BaseComponent } from 'src/app/components/base/base.component';
import { AppService } from 'src/app/app.service';
import { ModalType } from 'src/app/components/generic-modal/generic-modal.component';
import { FeedbackTypes } from 'src/app/dtos/enums';
import { NewFeedbackComponent } from 'src/app/components/new-feedback/new-feedback.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GenericImageCropperComponent } from 'src/app/components/generic-image-cropper/generic-image-cropper.component';

@Component({
  selector: 'event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.scss']
})
export class EventInfoComponent extends BaseComponent implements OnInit {

  users: RoomUser[];
  roomState: Observable<fromRoom.State>;
  user: User;

  editMode: boolean = false;

  updateInfo = new FormGroup({
    title: new FormControl("", [Validators.required, Validators.maxLength(40)]),
    description: new FormControl("", [Validators.required, Validators.maxLength(500)]),
  });

  imageChangedEvent: any = '';
  croppedImage: any = '';


  title: string;
  description: string;
  isImageLoaded: boolean = false;

  constructor(
    private roomService: RoomService,
    public dialogRef: MatDialogRef<any>,
    private store: Store<fromApp.AppState>,
    private appService: AppService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {room: Room},
    injector: Injector
  ) {
    super(injector);
    this.user = this.authService.user;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.roomState = this.store.select('roomState');
    let roomSub = this.roomState.subscribe(p => {
      let room = p.rooms.find(r => r._id === this.data.room._id);
      if(room && (!room.users || room.users.length === 0)) this.roomService.getRoomUsers(this.data.room).subscribe(u => {
        this.users = u;
      })
      else {
        this.users = room.users;
      };
    });
    this.subscription.add(roomSub);
    let formSub = this.updateInfo.valueChanges.subscribe(p => {
      this.title = p.title;
      this.description = p.description;
    });
    this.subscription.add(formSub);
    if (this.data.room.imageURI) this.croppedImage = this.data.room.imageURI;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isModerator() {
    return this.data.room.moderatorUser._id === this.authService.user._id;
  }

  onKickUser(user: User) {
    this.roomService.kickUser(this.data.room._id, {_id: user._id, nickname: user.nickname});
  }

  cancelEvent() {
    this.appService.openModal(undefined, 'cancelQuestion', undefined, ModalType.Confirmation).subscribe(p => {
      if (p) {
        this.roomService.cancelEvent(this.data.room._id);
        this.dialogRef.close();
      }
    });
  }

  leaveEvent() {
    this.appService.openModal(undefined, 'leaveQuestion', undefined, ModalType.Confirmation).subscribe(p => {
      if (p) {
        this.roomService.leaveRoom(this.data.room._id, this.authService.user._id);
        this.dialogRef.close();
      }
    });
  }

  report(user?: User) {
    let data = {
      event: this.data.room,
      type: FeedbackTypes.report,
      ownerUser: this.user
    }
    if (user) data["user"] = user;
    const dialogRef = this.dialog.open(NewFeedbackComponent, {
      minWidth: '250px',
      maxWidth: '600px',
      data
    });
    dialogRef.afterClosed().subscribe(result => { });
  }

  edit() {
    this.editMode = true;
    this.updateInfo.controls["title"].setValue(this.data.room.title);
    this.updateInfo.controls["description"].setValue(this.data.room.description);
    this.title = this.data.room.title;
    this.description = this.data.room.description;
  }

  save() {
    let room = new Room();
    room._id = this.data.room._id;
    room.title = this.updateInfo.value.title;
    room.description = this.updateInfo.value.description;
    room.base64 = this.croppedImage;
    this.roomService.updateRoomInfo({...room}).subscribe(p => {
      this.editMode = false;
      this.dialogRef.close();
    });
  }

  cancel() {
    this.editMode = false;
  }

  checkValid() {
    let titleEquality = this.title === this.data.room.title;
    let descEquality = this.description === this.data.room.description;
    let final = titleEquality === true && descEquality === true
    return (this.updateInfo.valid === true && final === false) || this.isImageLoaded === true;
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
      data: { croppedImage: this.croppedImage, imageBase64: imageBase64 }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.imageBase64) {
        this.croppedImage = result.imageBase64;
        this.isImageLoaded = true;
      }
    });
  }

  uploadImg(fileInput: HTMLInputElement) {
    fileInput.click();
  }

}
