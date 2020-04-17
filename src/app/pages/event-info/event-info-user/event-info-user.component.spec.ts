import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventInfoUserComponent } from './event-info-user.component';

describe('EventInfoUserComponent', () => {
  let component: EventInfoUserComponent;
  let fixture: ComponentFixture<EventInfoUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventInfoUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventInfoUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
