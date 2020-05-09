import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { UserProfileRoutingModule } from './user-profile-routing.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { RatingModule } from 'src/app/components/rating/rating.module';
import { NewCommentModule } from 'src/app/components/new-comment/new-comment.module';
import { UsersCommentsModule } from 'src/app/components/users-comments/user-comments.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { EventsModule } from 'src/app/components/events/events.module';

@NgModule({
  declarations: [
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    UserProfileRoutingModule,
    PipesModule,
    DirectivesModule,
    RatingModule,
    NewCommentModule,
    UsersCommentsModule,
    MatTabsModule,
    MatCardModule,
    EventsModule
  ]
})

export class UserProfileModule { }
