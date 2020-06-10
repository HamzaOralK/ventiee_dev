import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { LoadingOverlayComponent } from './loading-overlay.component';


@NgModule({
  declarations: [
    LoadingOverlayComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    DirectivesModule
  ],
  exports: [
    LoadingOverlayComponent
  ]
})

export class LoadingOverlayModule { }
