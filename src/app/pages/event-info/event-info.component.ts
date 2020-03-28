import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/dtos/user';
import { RoomService } from 'src/app/services/dataServices/room/room.service';
import { Room } from 'src/app/dtos/room';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.scss']
})
export class EventInfoComponent implements OnInit {

  users: User[];

  constructor(
    private roomService: RoomService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: {room: Room}
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.roomService.getRoomUsers(this.data.room._id).subscribe(p => {
      console.log(p);
      this.users = p;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isModerator() {
    return this.data.room.moderatorId === this.authService.user.id;
  }

  kickUser(user: User) {
    console.log(user);
  }

}
