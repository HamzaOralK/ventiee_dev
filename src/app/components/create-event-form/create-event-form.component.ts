import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { Event } from 'src/app/dtos/event';
import { EventService } from 'src/app/services/dataServices/event/event-service.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { LangService } from 'src/app/services/lang/lang.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

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


  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  filteredTags: Observable<string[]>;
  tags: string[] = ['Sokak'];
  allTags: string[] = ['Alkollü', 'Konser', 'Oyun', 'Gezmece'];

  @Input() eventId: string;
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  isLinear = true;
  generalDescription = new FormGroup({
    id: new FormControl(""),
    title: new FormControl(""),
    description: new FormControl("", [Validators.maxLength(100)]),
    peopleCount: new FormControl("", [Validators.min(3)]),
    tags: new FormControl()
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
    private eventService: EventService,
    private notificationService: NotificationService,
    private langService: LangService,
    private authService: AuthService
  ) {
    this.filteredTags = this.generalDescription.controls["tags"].valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allTags.slice()));
  }

  ngOnInit(): void {
    this.generalDescription.patchValue({ id: this.eventId });
  }

  createEvent() {
    let newEvent = new Event();
    newEvent.title = this.generalDescription.value.title;
    newEvent.moderatorUserId = this.authService.user._id;
    newEvent.userName = this.authService.user.nickname;
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
      this.eventService.addEvent(newEvent);
    }
  }

  formControls(formGroup: FormGroup): any {
    return formGroup['controls'];
  }

  /** Tag Chips */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: string): void {
    const index = this.tags.indexOf(fruit);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    //this.fruitCtrl.setValue(null);
  }
  /*******/
}
