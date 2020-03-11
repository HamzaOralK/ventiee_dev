import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
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

/** Reducers */
import * as fromApp from './store/app.reducer';
import { ChatsComponent } from './components/chats/chats.component';
import { ChatRoomsComponent } from './components/chats/chat-rooms/chat-rooms.component';
import { ChattingComponent } from './pages/chatting/chatting.component';
import { MultiLanguagePipe } from './pipes/multi-language.pipe';
import { LowerCaseDirective } from './directives/lower-case.directive';
import { OnlyNumbersDirective } from './directives/only-numbers.directive';

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
    MultiLanguagePipe,
    LowerCaseDirective,
    OnlyNumbersDirective
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
    MatStepperModule
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
