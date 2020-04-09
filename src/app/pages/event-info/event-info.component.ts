import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/dtos/user';
import { RoomService } from 'src/app/services/dataServices/room/room.service';
import { Room } from 'src/app/dtos/room';
import * as fromRoom from '../../services/dataServices/room/store/room.reducer';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.scss']
})
export class EventInfoComponent implements OnInit {

  users: User[];
  roomState: Observable<fromRoom.State>;

  constructor(
    private roomService: RoomService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<any>,
    private store: Store<fromApp.AppState>,
    @Inject(MAT_DIALOG_DATA) public data: {room: Room}
  ) { }

  ngOnInit(): void {
    this.roomService.getRoomUsers(this.data.room);
    this.roomState = this.store.select('roomState');
    this.roomState.subscribe(p => {
      this.users = p.activeRoom.users;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isKickable(user) {
    return user._id !== this.authService.user.id;
  }

  isModerator() {
    return this.data.room.moderatorUserId === this.authService.user.id;
  }

  isUserModerator(user) {
    return this.data.room.moderatorUserId === user._id;
  }

  kickUser(user: User) {
    console.log(user);
  }

}
