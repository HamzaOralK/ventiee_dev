import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { RoomComponent } from './room/room.component';
import { RoomRoutingModule } from './room-routing.module';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NewFeedbackComponent } from 'src/app/components/new-feedback/new-feedback.component';
import { NewFeedbackModule } from 'src/app/components/new-feedback/new-feedback.module';

@NgModule({
  declarations: [
    RoomComponent
  ],
  imports: [
    CommonModule,
    RoomRoutingModule,
    PipesModule,
    DirectivesModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NewFeedbackModule
  ],
  exports: [
    RoomComponent
  ]
})

export class RoomModule { }
