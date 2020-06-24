import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventPageComponent } from './pages/event-page/event-page.component';
import { AuthGuard } from './auth/auth.guard';
import { ResendComponent } from './pages/resend/resend.component';
import { VerifyComponent } from './pages/verify/verify.component';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)},
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)},
  { path: 'signup', loadChildren: () => import('./pages/sign-up/sign-up.module').then(m => m.SignUpModule)},
  { path: 'forgotPassword', loadChildren: () => import('./pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)},
  { path: 'resetPassword/:token', loadChildren: () => import('./pages/new-password/new-password.module').then(m => m.NewPasswordModule)},
  { path: 'resend/:user', component: ResendComponent},
  { path: 'verify/:hash', component: VerifyComponent},
  { path: 'ventiee/:id', component: EventPageComponent, canActivate: [AuthGuard]},
  { path: 'room/:id', loadChildren: () => import('./pages/room/room.module').then(m => m.RoomModule), canActivate: [AuthGuard]},
  { path: 'profile/:id', loadChildren: () => import('./pages/user-profile/user-profile.module').then(m => m.UserProfileModule), canActivate: [AuthGuard]},
  { path: 'userSettings/:id', loadChildren: () => import('./pages/user-settings/user-settings.module').then(m => m.UserSettingsModule), canActivate: [AuthGuard]},
  { path: 'createEvent', loadChildren: () => import('./pages/create-event/create-event.module').then(m => m.CreateEventModule), canActivate: [AuthGuard]},
  { path: 'eventCalendar', loadChildren: () => import('./components/event-calendar/event-calendar.module').then(m => m.EventCalendarModule), canActivate: [AuthGuard]},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
