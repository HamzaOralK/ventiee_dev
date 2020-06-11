import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CalendarView, CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarDateFormatter, DAYS_OF_WEEK } from 'angular-calendar';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject, Observable } from 'rxjs';
import { RoomService } from 'src/app/services/dataServices/room/room.service';
import { CustomDateFormatter } from '../custom-date-formatter.provider';
import { Event } from 'src/app/dtos/event';
import { MatDialog } from '@angular/material/dialog';
import { EventInfoComponent } from 'src/app/pages/event-info/event-info.component';
import * as fromRoom from '../../../services/dataServices/room/store/room.reducer';
import * as fromAuth from '../../../services/auth/store/auth.reducer';
import * as fromApp from "../../../store/app.reducer";
import { Store } from '@ngrx/store';
import { COMMONS } from 'src/app/shared/commons';



export interface CustomCalendarEvent extends CalendarEvent {
  eventInformation?: Event
}

@Component({
  selector: 'event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class EventCalendarComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  weekendDays: number[] = [DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];
  /** TODO: langService */
  locale: string = 'tr';

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = false;

  roomState: Observable<fromRoom.State>;

  constructor(
    private roomService: RoomService,
    private store: Store<fromApp.AppState>,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.events = [];
    this.roomState = this.store.select("roomState");
    this.roomState.subscribe(p => {
      if(p.rooms.length > 0 && this.events.length === 0) {
        this.transformRooms();
        this.cdr.detectChanges();
      }
    })
  }

  transformRooms() {
    this.roomService.rooms.forEach(p => {
      let ev: CustomCalendarEvent = {
        start: new Date(p.startDate),
        end: p.endDate ? new Date(p.endDate) : undefined,
        title: p.title,
        eventInformation: p,
        color: this.generateEventColors()
      };
      this.events.push(ev);
    });
    this.refresh.next(true);
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({ event,  newStart, newEnd, }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CustomCalendarEvent): void {
    this.modalData = { event, action };
    if (action === 'Clicked') {
      this.openDialog(this.modalData);
    }
  }

  openDialog(data: { action: string, event: CustomCalendarEvent}): void {
    const dialogRef = this.dialog.open(EventInfoComponent, {
      data: {room: data.event.eventInformation}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: this.generateEventColors(),
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  generateEventColors() {
    return { primary: COMMONS.generateRandomHexColor(), secondary: COMMONS.generateRandomHexColor() }
  }

}
