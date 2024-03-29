import { Component, OnInit, Injector, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from 'src/app/components/base/base.component';
import { Room, RoomUser } from 'src/app/dtos/room';
import { User } from 'src/app/dtos/user';
import { Router } from '@angular/router';

@Component({
  selector: 'event-info-user',
  templateUrl: './event-info-user.component.html',
  styleUrls: ['./event-info-user.component.scss']
})
export class EventInfoUserComponent extends BaseComponent implements OnInit {

  @Input() room: Room;
  @Input() user: RoomUser;
  @Output() onKickUser = new EventEmitter();
  @Output() onReport = new EventEmitter();
  @Output() closeDialog = new EventEmitter();

  constructor(injector: Injector, private router: Router) {
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

  kickUser(user: Partial<User>) {
    this.onKickUser.emit(user);
  }

  report(user: Partial<User>) {
    this.onReport.emit(user);
  }

  goUser() {
    this.closeDialog.emit();
    this.router.navigate(['/profile', this.user.user._id]);
  }

}
