import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventLineWithCommentComponent } from './event-line-with-comment.component';

describe('EventLineWithCommentComponent', () => {
  let component: EventLineWithCommentComponent;
  let fixture: ComponentFixture<EventLineWithCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventLineWithCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventLineWithCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
