import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

import { StoreModule } from '@ngrx/store';

import { NgxMaskModule } from "ngx-mask";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopNavigationComponent } from './layout/top-navigation/top-navigation.component';
import { LeftNavigationComponent } from './layout/left-navigation/left-navigation.component';
import { MainPageComponent } from './layout/main-page/main-page.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { EventLineComponent } from './components/event-line/event-line.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SignUpFormComponent } from './components/sign-up-form/sign-up-form.component';
import { EventPageComponent } from './pages/event-page/event-page.component';
import { UserSettingsComponent } from './pages/user-settings/user-settings.component';
import { RoomNavigationComponent } from "./layout/room-navigation/room-navigation.component";
import { CreateEventComponent } from "./pages/create-event/create-event.component";
import { CreateEventFormComponent } from "./components/create-event-form/create-event-form.component";
import { ChatsComponent } from './components/chats/chats.component';
import { ChatRoomsComponent } from './components/chats/chat-rooms/chat-rooms.component';
import { ChattingComponent } from './pages/chatting/chatting.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';

/** Material Components */
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatStepperModule } from "@angular/material/stepper";
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';


/** Reducers */
import * as fromApp from './store/app.reducer';

/** TimePicker */
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { EventInfoComponent } from './pages/event-info/event-info.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { EventCalendarModule } from './components/event-calendar/event-calendar.module';

/** Shared Modules */
import { PipesModule } from './shared/pipes/pipes.module';
import { DirectivesModule } from './shared/directives/directives.module';
import { EventsComponent } from './components/events/events.component';
import { UsersCommentsComponent } from './pages/users-comments/users-comments.component';
import { NewCommentComponent } from './pages/new-comment/new-comment.component';
import { RatingComponent } from './components/rating/rating.component';
import { ResendComponent } from './pages/resend/resend.component';
import { BaseComponent } from './components/base/base.component';
import { VerifyComponent } from './pages/verify/verify.component';
import { EventInfoUserComponent } from './pages/event-info/event-info-user/event-info-user.component';

@NgModule({
  declarations: [
    AppComponent,
    TopNavigationComponent,
    LeftNavigationComponent,
    MainPageComponent,
    HomeComponent,
    LoginComponent,
    SignUpComponent,
    EventLineComponent,
    LoginFormComponent,
    SignUpFormComponent,
    EventPageComponent,
    UserSettingsComponent,
    RoomNavigationComponent,
    CreateEventComponent,
    CreateEventFormComponent,
    ChatsComponent,
    ChatRoomsComponent,
    ChattingComponent,
    EventInfoComponent,
    UserProfileComponent,
    EventsComponent,
    UsersCommentsComponent,
    NewCommentComponent,
    RatingComponent,
    ResendComponent,
    BaseComponent,
    VerifyComponent,
    EventInfoUserComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskModule,
    StoreModule.forRoot(fromApp.appReducer),
    /** Material Components */
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTabsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatStepperModule,
    MatBadgeModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatListModule,
    MatCheckboxModule,
    MatSelectModule,
    /** Additional */
    NgxMaterialTimepickerModule.setLocale("tr-TR"),
    EventCalendarModule,
    PipesModule,
    DirectivesModule
  ],
  exports: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
