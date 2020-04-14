import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { Event } from 'src/app/dtos/event';
import { EventService } from 'src/app/services/dataServices/event/event-service.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { LangService } from 'src/app/services/lang/lang.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: "create-event-form",
  templateUrl: "./create-event-form.component.html",
  styleUrls: ["./create-event-form.component.scss"],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "tr-TR" },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class CreateEventFormComponent implements OnInit {
  @Input() eventId: string;

  isLinear = true;
  generalDescription = new FormGroup({
    id: new FormControl(""),
    title: new FormControl(""),
    peopleCount: new FormControl()
  });

  timeInformation = new FormGroup({
    startTime: new FormControl(),
    startDate: new FormControl(),
    endTime: new FormControl(),
    endDate: new FormControl()
  });

  placeInformation = new FormGroup({
    venue: new FormControl(),
    location: new FormGroup({
      district: new FormControl(""),
      city: new FormControl(""),
      longtitute: new FormControl(""),
      latitute: new FormControl("")
    })
  });

  constructor(
    private _adapter: DateAdapter<any>,
    private eventService: EventService,
    private notificationService: NotificationService,
    private langService: LangService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.generalDescription.patchValue({ id: this.eventId });
  }

  createEvent() {
    //console.log(this.generalDescription.value);
    //console.log(this.timeInformation.value);
    //console.log(this.placeInformation.value);
    let newEvent = new Event();
    newEvent.title = this.generalDescription.value.title;
    newEvent.moderatorUserId = this.authService.user._id;
    newEvent.peopleCount = this.generalDescription.value.peopleCount;
    let formStartDate: Date = new Date(this.timeInformation.value.startDate);
    let formStartTime: string = this.timeInformation.value.startTime;
    let formStartHour: number = parseInt(formStartTime.split(":")[0]);
    let formStartMin: number = parseInt(formStartTime.split(":")[1]);
    let startDate: Date = new Date(
      formStartDate.getFullYear(),
      formStartDate.getMonth(),
      formStartDate.getDate(),
      formStartHour,
      formStartMin
    );
    newEvent.startDate = startDate;
    let formEndDate: Date = new Date(this.timeInformation.value.endDate);
    let formEndTime: string = this.timeInformation.value.endTime;
    let formEndHour: number = parseInt(formEndTime.split(":")[0]);
    let formEndMin: number = parseInt(formEndTime.split(":")[1]);
    let endDate: Date = new Date(
      formEndDate.getFullYear(),
      formEndDate.getMonth(),
      formEndDate.getDate(),
      formEndHour,
      formEndMin
    );
    newEvent.endDate = endDate;
    newEvent.venue = this.placeInformation.value.venue;
    newEvent.city = this.placeInformation.value.location.city;
    newEvent.district = this.placeInformation.value.location.district;
    newEvent.latitute = this.placeInformation.value.location.latitute;
    newEvent.longtitute = this.placeInformation.value.location.longtitute;
    if (
      newEvent.startDate > newEvent.endDate ||
      newEvent.startDate < new Date()
    ) {
      this.notificationService.notify(this.langService.get("timeError"), "OK");
    } else {
      this.eventService.addEvent(newEvent).subscribe(p => {
        if (p.msg === "Event successfully saved") {
          this.notificationService.notify(
            this.langService.get("eventCreateSuccess"),
            "OK"
          );
          /** TODO: /event/add olduktan sonra idsinin dönmesi ve adamın eventlerine eklenmesi */
          this.router.navigate(["/event/5e484a779be75f28e860bdef"]);
        }
      });
    }
    console.log(newEvent);
  }
}
