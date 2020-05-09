import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersCommentsComponent } from './users-comments.component';
import { MatCardModule } from '@angular/material/card';
import { RatingModule } from '../rating/rating.module';

@NgModule({
  declarations: [
    UsersCommentsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    RatingModule
  ],
  exports: [
    UsersCommentsComponent
  ]
})

export class UsersCommentsModule { }
