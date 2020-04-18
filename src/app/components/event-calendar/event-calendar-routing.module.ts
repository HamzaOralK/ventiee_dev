import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventCalendarComponent } from './event-calendar/event-calendar.component';
import { AuthGuard } from 'src/app/auth/auth.guard';


const routes: Routes = [
  { path: '', component: EventCalendarComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventCalendarRoutingModule { }
