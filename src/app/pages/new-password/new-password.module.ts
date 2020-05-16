import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPasswordComponent } from './new-password/new-password.component';
import { NewPasswordRoutingModule } from './new-password-routing.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { NewPasswordFormModule } from 'src/app/components/new-password-form/new-password-form.module';


@NgModule({
  declarations: [
    NewPasswordComponent
  ],
  imports: [
    CommonModule,
    NewPasswordRoutingModule,
    PipesModule,
    DirectivesModule,
    NewPasswordFormModule
  ]
})
export class NewPasswordModule { }
