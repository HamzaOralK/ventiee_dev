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
import { ChatsModule } from 'src/app/components/chats/chats.module';
import { MatTabsModule } from '@angular/material/tabs';
import { RoomModule } from '../room/room.module';

@NgModule({
  declarations: [
    HomeComponent,
    LandingComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    HomeRoutingModule,
    PipesModule,
    DirectivesModule,
    EventsModule,
    SignUpFormModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    ChatsModule,
    RoomModule
  ],
})
export class HomeModule { }
