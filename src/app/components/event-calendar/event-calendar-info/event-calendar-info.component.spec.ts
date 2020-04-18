import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCalendarInfoComponent } from './event-calendar-info.component';

describe('EventCalendarInfoComponent', () => {
  let component: EventCalendarInfoComponent;
  let fixture: ComponentFixture<EventCalendarInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventCalendarInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCalendarInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
