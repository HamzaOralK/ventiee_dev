import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NewFeedbackComponent } from './new-feedback.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { RatingModule } from '../rating/rating.module';
import { LoadingOverlayModule } from '../loading-overlay/loading-overlay.module';


@NgModule({
  declarations: [
    NewFeedbackComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DirectivesModule,
    PipesModule,
    RatingModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    LoadingOverlayModule
  ],
  exports: [
    NewFeedbackComponent
  ],
  entryComponents: [NewFeedbackComponent]
})

export class NewFeedbackModule { }
