import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NewPasswordFormComponent } from './new-password-form.component';
import { PasswordFormElementModule } from '../password-form-element/password-form-element.module';



@NgModule({
  declarations: [
    NewPasswordFormComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    DirectivesModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    PasswordFormElementModule
  ],
  exports: [
    NewPasswordFormComponent
  ]
})
export class NewPasswordFormModule { }
