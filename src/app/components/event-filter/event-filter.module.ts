import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventFilterComponent } from './event-filter/event-filter.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' },
  ],
  declarations: [EventFilterComponent],
  imports: [
    CommonModule,
    PipesModule,
    DirectivesModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule
  ],
  exports: [
    EventFilterComponent
  ]
})
export class EventFilterModule { }
