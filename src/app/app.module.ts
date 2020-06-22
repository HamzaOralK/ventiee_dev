import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
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
import { EventPageComponent } from './pages/event-page/event-page.component';
// import { ChatsComponent } from './components/chats/chats.component';
// import { ChatRoomsComponent } from './components/chats/chat-rooms/chat-rooms.component';

/** Material Components */
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from "@angular/material/stepper";
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";

import { EventInfoComponent } from './pages/event-info/event-info.component';
import { AuthInterceptor } from './auth/auth-interceptor';

/** Reducers */
import * as fromApp from './store/app.reducer';

/** Shared Modules */
import { PipesModule } from './shared/pipes/pipes.module';
import { DirectivesModule } from './shared/directives/directives.module';
import { ResendComponent } from './pages/resend/resend.component';
import { BaseComponent } from './components/base/base.component';
import { VerifyComponent } from './pages/verify/verify.component';
import { EventInfoUserComponent } from './pages/event-info/event-info-user/event-info-user.component';
import { VfooterComponent } from './layout/vfooter/vfooter.component';
import { EventsModule } from './components/events/events.module';
import { SignUpFormModule } from './components/sign-up-form/sign-up-form.module';
import { ChatsModule } from './components/chats/chats.module';
import { LoadingOverlayModule } from './components/loading-overlay/loading-overlay.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { PwaPromptComponent } from './components/pwa-prompt/pwa-prompt.component';
import { PwaService } from './services/pwa/pwa.service';
import { LangService } from './services/lang/lang.service';

const initializer = (pwaService: PwaService, langService: LangService) => () => {
  pwaService.initPwaPrompt();
  langService.decideDict();
}


@NgModule({
  declarations: [
    AppComponent,
    TopNavigationComponent,
    LeftNavigationComponent,
    MainPageComponent,
    EventPageComponent,
    EventInfoComponent,
    ResendComponent,
    BaseComponent,
    VerifyComponent,
    EventInfoUserComponent,
    VfooterComponent,
    PwaPromptComponent,
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
    MatStepperModule,
    MatBadgeModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatListModule,
    MatCheckboxModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatBottomSheetModule,
    /** Additional */
    PipesModule,
    DirectivesModule,
    EventsModule,
    SignUpFormModule,
    ChatsModule,
    LoadingOverlayModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
  ],
  exports: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      deps: [PwaService, LangService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
