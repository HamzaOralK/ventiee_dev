import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { RouterModule } from '@angular/router';
import { SignUpFormComponent } from './sign-up-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PasswordFormElementModule } from '../password-form-element/password-form-element.module';


@NgModule({
  declarations: [
    SignUpFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PipesModule,
    DirectivesModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    PasswordFormElementModule
  ],
  exports: [
    SignUpFormComponent
  ]
})

export class SignUpFormModule { }
