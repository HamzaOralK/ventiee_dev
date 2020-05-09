import { NgModule } from '@angular/core';
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { CommonModule } from '@angular/common';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { CreateEventFormComponent } from './create-event-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
/** TimePicker */

@NgModule({
  declarations: [
    CreateEventFormComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    ReactiveFormsModule,
    DirectivesModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatMomentDateModule,
    NgxMaterialTimepickerModule.setLocale("tr-TR"),
  ],
  exports: [ CreateEventFormComponent ]
})

export class CreateEventFormModule {

}
