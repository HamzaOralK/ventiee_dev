import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { GenericModalComponent } from './generic-modal.component';


@NgModule({
  declarations: [
    GenericModalComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    DirectivesModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  exports: [
    GenericModalComponent
  ],
  entryComponents: [ GenericModalComponent ]
})

export class GenericModalModule { }
