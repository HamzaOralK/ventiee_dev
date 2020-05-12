import { Component, OnInit, Injector, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from 'src/app/components/base/base.component';
import { Room } from 'src/app/dtos/room';
import { User } from 'src/app/dtos/user';

@Component({
  selector: 'event-info-user',
  templateUrl: './event-info-user.component.html',
  styleUrls: ['./event-info-user.component.scss']
})
export class EventInfoUserComponent extends BaseComponent implements OnInit {

  @Input() room: Room;
  @Input() user: User;
  @Output() onKickUser = new EventEmitter();

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  isKickable(user) {
    return user._id !== this.authService.user._id;
  }

  isModerator() {
    return this.room.moderatorUser._id === this.authService.user._id;
  }

  isUserModerator(user) {
    return this.room.moderatorUser._id === user._id;
  }

  kickUser(user: User) {
    this.onKickUser.emit(user);
  }

}
