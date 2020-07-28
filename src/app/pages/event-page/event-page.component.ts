import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { EventService } from 'src/app/services/dataServices/event/event-service.service';
import { Event } from '../../dtos/event';
import { switchMap } from 'rxjs/operators';
import * as fromApp from '../../store/app.reducer';
import * as fromRoom from '../../services/dataServices/room/store/room.reducer';
import { Store } from '@ngrx/store';
import { RoomService } from 'src/app/services/dataServices/room/room.service';
import { Room } from 'src/app/dtos/room';
import { AppService } from 'src/app/app.service';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.scss']
})
export class EventPageComponent implements OnInit, OnDestroy {

  roomState: Observable<fromRoom.State>;
  event$: Observable<any>;
  event: Event;
  joinable: boolean;
  subscription = new Subscription();
  isChecking = true;

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private roomService: RoomService,
    private appService: AppService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.roomState = this.store.select('roomState');
    let eventId = this.route.snapshot.paramMap.get('id');
    this.event$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.eventService.getEventById(params.get('id')))
    );
    let checksub;
    let eventsub = this.event$.subscribe(p => {
      this.event = p[0];
      checksub = this.roomState.subscribe(p => {
        let index = p.rooms.findIndex(r => r._id === this.event._id);
        if (index === -1) {
          this.joinable = true;
        }
        else {
          this.joinable = false;
        };
        this.isChecking = false;
      });
      this.subscription.add(checksub);
    });
    this.subscription.add(eventsub);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  joinEvent() {
    let userNewRoom = new Room();
    userNewRoom._id = this.event._id;
    if(this.authService.user) {
      let jSub = this.roomService.joinRoom(userNewRoom).subscribe(p => {
        if (this.appService.smallScreen) {
          this.router.navigate(['/room/' + this.event._id]);
        } else {
          this.router.navigate(['/home']);
        }
      });
      this.subscription.add(jSub);
    } else {
      this.router.navigate(['/login'], {queryParams: {url: '/ventiee/'+this.event._id}});
    }
  }

}
