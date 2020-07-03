import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import * as fromApp from "../../../store/app.reducer";
import { NotificationService, SnackType } from 'src/app/services/notification/notification.service';


@Component({
  selector: 'create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {
  eventId: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.store.select("roomState").subscribe((p) => {
      if (p) {
        if (p.rooms.length >= environment.maxRoomNumber) {
          this.router.navigate(['/home']);
          this.notificationService.notify("maxRoomNumberReached", SnackType.warn, "OK");
        }
      }
    });
  }


}
