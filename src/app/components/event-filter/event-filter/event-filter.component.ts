import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { EventService } from 'src/app/services/dataServices/event/event-service.service';
import { Subscription } from 'rxjs';
import { EventFilter, EventStatus } from 'src/app/dtos/event';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { PlaceService } from 'src/app/services/dataServices/place/place.service';

@Component({
  selector: 'event-filter',
  templateUrl: './event-filter.component.html',
  styleUrls: ['./event-filter.component.scss']
})
export class EventFilterComponent implements OnInit {

  subscription: Subscription;

  @Input('showFilter') showFilter: boolean;
  @Input('eventFilter') eventFilter: EventFilter;
  @Output('onSearch') onSearch: EventEmitter<any> = new EventEmitter();

  allTags: { tag: string }[];
  tags: string[] = [];
  date: FormControl = new FormControl();
  city: FormControl = new FormControl();
  district: FormControl = new FormControl();

  /** Adres bloğu */
  states: any[];
  cities: { name: string, city_code: string }[] = [];
  districts: { id: number, latitude: string, longitude: string, name: string }[] = [];




  constructor(
    private eventService: EventService,
    private placeService: PlaceService
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.tags = this.eventFilter.tags;

    let valSub = this.date.valueChanges.subscribe(p => {
      if(p) this.eventFilter.startDate = p.toDate();
    });
    this.subscription.add(valSub);

    let tagSub = this.eventService.getTags().subscribe((p: { tag: string }[]) => {
      this.allTags = p;
    })
    this.subscription.add(tagSub);

    let placeSub = this.placeService.getCountySubDivs().subscribe(p => {
      if (p.cities) {
        this.cities = p.cities;
      }
    });
    this.subscription.add(placeSub);
  }


  addRemoveTag(tag: string) {
    if(!this.tags) this.tags = [];
    let value: string[] = this.tags;
    let index = value.findIndex(p => p === tag);
    if (index === -1) {
      value.push(tag);
      this.tags = value;
    } else {
      value.splice(index, 1);
      this.tags = value;
    }
  }

  isSelectedTag(tag: string) {
    if(this.tags) return (this.tags as string[]).find(p => p === tag);
    else return false;
  }

  search() {
    this.onSearch.emit(this.eventFilter);
  }


  cityChanged(event: MatSelectChange) {
    if (event.value) {
      this.eventFilter.city = event.value;
      this.placeService.getDistricts(event.value).subscribe(p => {
        this.districts = p;
      })
    }
    else {
      this.eventFilter.city = undefined;
      this.districts = [];
      this.eventFilter.district = undefined;
    }
  }

  districtChanged(event: MatSelectChange) {
    if (event.value) {
      this.eventFilter.district = event.value;
    }
    else {
      this.eventFilter.district = undefined;
    }
  }

  clearSearch() {
    this.date.setValue(undefined);
    this.city.setValue(undefined);
    this.district.setValue(undefined);
    this.tags = undefined;
    this.eventFilter = new EventFilter(EventStatus.Active);
    this.onSearch.emit(this.eventFilter);
  }

}
