import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { timer, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PwaPromptComponent } from 'src/app/components/pwa-prompt/pwa-prompt.component';
import { Store } from '@ngrx/store';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromApp from '../../store/app.reducer';
import { User } from 'src/app/dtos/user';

@Injectable({
  providedIn: "root",
})
export class PwaService {
  private promptEvent: any;
  auth: Observable<fromAuth.State>;
  user: User;

  constructor(
    private platform: Platform,
    private bottomSheet: MatBottomSheet,
    private store: Store<fromApp.AppState>
  ) {
    this.auth = this.store.select('authState');
    this.auth.subscribe(p => {
      this.user = p.user;
    });
  }

  public initPwaPrompt() {
    if(!this.user) {
      if (this.platform.ANDROID) {
        window.addEventListener("beforeinstallprompt", (event: any) => {
          event.preventDefault();
          this.promptEvent = event;
          this.openPromptComponent("android");
        });
      }
      if (this.platform.IOS) {
        const isInStandaloneMode = "standalone" in window.navigator && window.navigator["standalone"];
        if (!isInStandaloneMode) {
          this.openPromptComponent("ios");
        }
      }
    }
  }

  private openPromptComponent(mobileType: "ios" | "android") {
    timer(3000)
    .pipe(take(1))
    .subscribe(() =>
      this.bottomSheet.open(PwaPromptComponent, { data: { mobileType, promptEvent: this.promptEvent }, })
    );
  }
}
