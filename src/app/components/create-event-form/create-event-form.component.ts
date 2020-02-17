import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
  selector: "create-event-form",
  templateUrl: "./create-event-form.component.html",
  styleUrls: ["./create-event-form.component.scss"],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'tr-TR'},

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}]
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
    time: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl()
  });

  placeInformation = new FormGroup({
    venue: new FormControl(),
    location: new FormGroup({
      district: new FormControl(""),
      city: new FormControl(""),
      long: new FormControl(""),
      lat: new FormControl("")
    })
  });

  constructor(private _adapter: DateAdapter<any>) {}

  ngOnInit(): void {
    this.generalDescription.patchValue({ id: this.eventId });
  }

  createEvent() {
    console.log(this.generalDescription.value);
    console.log(this.timeInformation.value);
    console.log(this.placeInformation.value);
  }
}
