import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { EventPageComponent } from './pages/event-page/event-page.component';
import { UserSettingsComponent } from './pages/user-settings/user-settings.component';
import { CreateEventComponent } from './pages/create-event/create-event.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignUpComponent},
  { path: 'event/:id', component: EventPageComponent, canActivate: [AuthGuard]},
  { path: 'userSettings/:id', component: UserSettingsComponent, canActivate: [AuthGuard]},
  { path: 'createEvent/:id', component: CreateEventComponent, canActivate: [AuthGuard]},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
