import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { HomeRoutingModule } from './home-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { EventsModule } from 'src/app/components/events/events.module';
import { SignUpFormModule } from 'src/app/components/sign-up-form/sign-up-form.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ChatsModule } from 'src/app/components/chats/chats.module';
import { MatTabsModule } from '@angular/material/tabs';
import { RoomModule } from '../room/room.module';
import { MatBadgeModule } from '@angular/material/badge';
import { EventFilterModule } from 'src/app/components/event-filter/event-filter.module';
import { TabsModule } from 'src/app/components/tabs/tabs.module';
// import { PendingEventsComponent } from './pending-events/pending-events.component';

@NgModule({
  declarations: [
    HomeComponent,
    LandingComponent,
    // PendingEventsComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    HomeRoutingModule,
    PipesModule,
    DirectivesModule,
    MatTabsModule,
    EventsModule,
    SignUpFormModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    ChatsModule,
    RoomModule,
    MatBadgeModule,
    EventFilterModule,
    TabsModule
  ],
})
export class HomeModule { }
