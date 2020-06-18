import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/dataServices/user/user.service';
import { User } from 'src/app/dtos/user';
import { EventService } from 'src/app/services/dataServices/event/event-service.service';
import { Event } from '../../../dtos/event';
import { Gender } from 'src/app/dtos/enums';


@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit, OnDestroy {

  user: User = undefined;
  events: Event[] = undefined;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private eventService: EventService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(p => {
      this.userService.getUserById(p.get('id')).toPromise()
      .then(p => {
        this.user = p;
        return p;
      })
      .then(user => {
        this.eventService.getEventsByModId(user._id).toPromise().then(events => {
          this.cdr.detectChanges();
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.user = undefined;
  }

  get genders() {
    return Gender;
  }



}
