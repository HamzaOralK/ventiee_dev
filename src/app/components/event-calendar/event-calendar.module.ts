import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { EventCalendarComponent } from './event-calendar/event-calendar.component';
import { EventCalendarRoutingModule } from './event-calendar-routing.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

registerLocaleData(localeTr);

@NgModule({
  declarations: [EventCalendarComponent],
  imports: [
    CommonModule,
    EventCalendarRoutingModule,
    MatButtonToggleModule,
    MatButtonModule,
    PipesModule,
    DirectivesModule,
    MatIconModule,
    MatDialogModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
  ],
  exports: [EventCalendarComponent]
})
export class EventCalendarModule { }
