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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EventFilterModule } from '../event-filter/event-filter.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NewCommentComponent } from '../new-comment/new-comment.component';
import { NewCommentModule } from '../new-comment/new-comment.module';
import { EventLineWithCommentComponent } from './event-line-with-comment/event-line-with-comment.component';
import { RatingModule } from '../rating/rating.module';

@NgModule({
  declarations: [
    EventsComponent,
    EventLineComponent,
    EventLineWithCommentComponent
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
    ScrollingModule,
    MatProgressSpinnerModule,
    EventFilterModule,
    MatFormFieldModule,
    MatInputModule,
    NewCommentModule,
    RatingModule
  ],
  exports: [
    EventsComponent
  ]
})

export class EventsModule { }
