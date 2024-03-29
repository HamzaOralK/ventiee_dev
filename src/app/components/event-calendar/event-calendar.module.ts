import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { CalendarModule, DateAdapter } from 'angular-calendar';
// import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { EventCalendarComponent } from './event-calendar/event-calendar.component';
import { EventCalendarRoutingModule } from './event-calendar-routing.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
// import localeTr from '@angular/common/locales/tr';
import "@angular/common/locales/global/tr"
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { environment } from 'src/environments/environment';

export function getCurentLocale(): string {
  let language = JSON.parse(localStorage.getItem(environment.loginLocalStorageKey)).user.language;
  if(language === 'en') return 'en-US';
  if(language === 'tr') return 'tr-TR';

}


// registerLocaleData(localeTr);

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
      useFactory: adapterFactory,
    }),
  ],
  exports: [EventCalendarComponent],
  // providers: [{ provide: LOCALE_ID, useValue: getCurentLocale() }],
})
export class EventCalendarModule {}
