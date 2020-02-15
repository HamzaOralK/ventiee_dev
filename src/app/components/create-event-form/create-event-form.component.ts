import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: "create-event-form",
  templateUrl: "./create-event-form.component.html",
  styleUrls: ["./create-event-form.component.scss"]
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

  constructor() {}

  ngOnInit(): void {
    this.generalDescription.patchValue({ id: this.eventId });
  }

  createEvent() {
    console.log(this.generalDescription.value);
    console.log(this.timeInformation.value);
    console.log(this.placeInformation.value);
  }
}
