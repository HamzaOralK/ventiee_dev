import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { UserSettingsRoutingModule } from './user-settings-routing.module';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NewPasswordFormModule } from 'src/app/components/new-password-form/new-password-form.module';
import { MatDialogModule } from '@angular/material/dialog';
import { GenericImageCropperModule } from 'src/app/components/generic-image-cropper/generic-image-cropper.module';

@NgModule({
  declarations: [UserSettingsComponent],
  imports: [
    CommonModule,
    UserSettingsRoutingModule,
    PipesModule,
    DirectivesModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatMomentDateModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatCardModule,
    MatCheckboxModule,
    NewPasswordFormModule,
    MatDialogModule,
    GenericImageCropperModule
  ]
})

export class UserSettingsModule { }
