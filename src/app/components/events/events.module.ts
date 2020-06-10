import { EventsComponent } from './events/events.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { EventLineComponent } from './event-line/event-line.component';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    EventsComponent,
    EventLineComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    DirectivesModule,
    MatExpansionModule,
    MatIconModule,
    RouterModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    ScrollingModule
  ],
  exports: [
    EventsComponent
  ]
})

export class EventsModule { }
