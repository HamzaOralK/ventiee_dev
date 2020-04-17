import { Component, OnInit, Inject, Injector } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/dtos/user';
import { RoomService } from 'src/app/services/dataServices/room/room.service';
import { Room } from 'src/app/dtos/room';
import * as fromRoom from '../../services/dataServices/room/store/room.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import { BaseComponent } from 'src/app/components/base/base.component';

@Component({
  selector: 'event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.scss']
})
export class EventInfoComponent extends BaseComponent implements OnInit {

  users: User[];
  roomState: Observable<fromRoom.State>;

  constructor(
    private roomService: RoomService,
    public dialogRef: MatDialogRef<any>,
    private store: Store<fromApp.AppState>,
    @Inject(MAT_DIALOG_DATA) public data: {room: Room},
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.roomService.getRoomUsers(this.data.room);
    this.roomState = this.store.select('roomState');
    this.roomState.subscribe(p => {
      this.users = p.activeRoom.users;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onKickUser(user: User) {
    console.log(user);
  }

}
