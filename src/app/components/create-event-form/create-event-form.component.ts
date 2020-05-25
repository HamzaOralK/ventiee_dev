import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Event } from 'src/app/dtos/event';
import { EventService } from 'src/app/services/dataServices/event/event-service.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { LangService } from 'src/app/services/lang/lang.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Observable, Subscription } from 'rxjs';

import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { PlaceService } from 'src/app/services/dataServices/place/place.service';
import { BaseComponent } from '../base/base.component';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: "create-event-form",
  templateUrl: "./create-event-form.component.html",
  styleUrls: ["./create-event-form.component.scss"],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "tr-TR" },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class CreateEventFormComponent implements OnInit, OnDestroy {
  subscription: Subscription;


  public imagePath;
  imgURL: any;

  visible = true;
  selectable = true;
  removable = true;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  filteredTags: Observable<string[]>;
  allTags: {tag: string}[];

  smallScreen: boolean;

  /** Adres bloğu */
  states: any[];
  cities: {name: string, city_code: string}[] = [];
  districts: {id: number, latitude: string, longitude: string, name: string}[] = [];

  @Input() eventId: string;
  @ViewChild("tagInput") tagInput: ElementRef<HTMLInputElement>;
  @ViewChild("auto") matAutocomplete: MatAutocomplete;
  @ViewChild("fileInput") fileInput: HTMLInputElement;
  @ViewChild('stepper') stepper: MatHorizontalStepper;

  isLinear = true;

  tagFilter = new FormControl();

  generalDescription = new FormGroup({
    title: new FormControl(""),
    description: new FormControl("", [Validators.maxLength(100)]),
    peopleCount: new FormControl("", [Validators.min(3)]),
    type: new FormControl('meeting', [Validators.required])
  });

  tags =  new FormControl([], [Validators.required]);

  timeInformation = new FormGroup({
    startTime: new FormControl(),
    startDate: new FormControl(),
    endTime: new FormControl(),
    endDate: new FormControl(),
  });

  placeInformation = new FormGroup({
    venue: new FormControl(),
    location: new FormGroup({
      district: new FormControl(""),
      city: new FormControl(""),
      longtitute: new FormControl(""),
      latitute: new FormControl(""),
    }),
  });

  constructor(
    private eventService: EventService,
    private notificationService: NotificationService,
    private langService: LangService,
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private placeService: PlaceService
  ) {
    this.subscription = new Subscription();

    breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe(result => {
      this.smallScreen = result.matches;
    });
  }

  ngOnInit(): void {
    this.generalDescription.patchValue({ id: this.eventId });
    this.imgURL = "https://static.vinepair.com/wp-content/uploads/2016/02/standard-pour-social.jpg";

    let tagSub = this.eventService.getTags().subscribe((p: { tag: string }[]) => {
      this.allTags = p;
    });
    this.subscription.add(tagSub);

    let placeSub = this.placeService.getCountySubDivs().subscribe(p => {
      if(p.cities) {
        this.cities = p.cities;
      }
    });

    this.subscription.add(placeSub);

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get eventType(): string {
    return this.generalDescription.controls["type"].value;
  }

  createEvent() {
    let newEvent = new Event();
    newEvent.title = this.generalDescription.value.title.trim();
    newEvent.moderatorUserId = this.authService.user._id;
    newEvent.peopleCount = this.generalDescription.value.peopleCount;
    newEvent.tags = this.tags.value;
    newEvent.description = this.generalDescription.value.description.trim();
    newEvent.type = this.generalDescription.value.type;
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
    let formEndDate: Date;
    let formEndTime: string;
    let formEndHour: number = 0;
    let formEndMin: number = 0;
    if (this.timeInformation.value.endDate)
      formEndDate = new Date(this.timeInformation.value.endDate);
    if (this.timeInformation.value.endTime) {
      formEndTime = this.timeInformation.value.endTime;
      formEndHour = parseInt(formEndTime.split(":")[0]);
      formEndMin = parseInt(formEndTime.split(":")[1]);
    }
    let endDate: Date;
    if (formEndDate) {
      endDate = new Date(
        formEndDate.getFullYear(),
        formEndDate.getMonth(),
        formEndDate.getDate(),
        formEndHour,
        formEndMin
      );
      newEvent.endDate = endDate;
    }
    if(this.eventType === 'meeting') {
      newEvent.venue = this.placeInformation.value.venue;
      newEvent.city = this.placeInformation.value.location.city;
      newEvent.district = this.placeInformation.value.location.district;
      newEvent.latitute = this.placeInformation.value.location.latitute;
      newEvent.longtitute = this.placeInformation.value.location.longtitute;
    }
    if (newEvent.endDate && newEvent.startDate > newEvent.endDate) {
      this.notificationService.notify(this.langService.get("startDateGtThanEndDate"), "OK");
    } else if (newEvent.startDate < new Date()) {
      this.notificationService.notify(this.langService.get("startDateGtThanNow"), "OK");
    } else {
      this.eventService.addEvent(newEvent);
    }
  }

  checkValid(): boolean {
    if(this.eventType === 'meeting')
      return (this.generalDescription.valid && this.timeInformation.valid && this.placeInformation.valid);
    else return (this.generalDescription.valid && this.timeInformation.valid);
  }

  formControls(formGroup: FormGroup): any {
    return formGroup["controls"];
  }

  uploadImg(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  preview(files) {
    if (files.length === 0) return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }

  get title() {
    return this.generalDescription.get("title").value;
  }

  addRemoveTag(tag: string) {
    let value: string[] = this.tags.value;
    let index = value.findIndex(p => p === tag);
    if(index === -1) {
      value.push(tag);
      this.tags.setValue(value);
    } else {
      value.splice(index,1);
      this.tags.setValue(value);
    }
  }

  isSelectedTag(tag: string) {
    return (this.tags.value as string[]).find(p => p === tag);
  }

  cityChanged(event: MatSelectChange) {
    if(event.value) {
      this.placeService.getDistricts(event.value).subscribe(p => {
        this.districts = p;
      })
    }
    else {
      this.districts = [];
      this.placeInformation.controls["location"].patchValue({district: undefined});
    }

  }

}
