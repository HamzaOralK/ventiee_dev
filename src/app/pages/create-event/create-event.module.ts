import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { CreateEventRoutingModule } from './create-event-routing.module';
import { CreateEventFormModule } from 'src/app/components/create-event-form/create-event-form.module';
import { CreateEventComponent } from './create-event/create-event.component';

@NgModule({
  declarations: [ CreateEventComponent ],
  imports: [
    CommonModule,
    CreateEventRoutingModule,
    PipesModule,
    DirectivesModule,
    CreateEventFormModule
  ]
})

export class CreateEventModule { }
