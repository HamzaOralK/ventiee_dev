import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AppAction from '../../store/app.actions'
import { Observable } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import * as fromAuth from '../../services/auth/store/auth.reducer';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/dtos/user';
import { AppService } from 'src/app/app.service';
import { EventListType, FeedbackTypes } from 'src/app/dtos/enums';
import { MatDialog } from '@angular/material/dialog';
import { NewFeedbackComponent } from 'src/app/components/new-feedback/new-feedback.component';
import { Languages } from 'src/app/dtos/languages';
import { FormControl } from '@angular/forms';
import { LangService } from 'src/app/services/lang/lang.service';

@Component({
  selector: 'top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.scss']
})
export class TopNavigationComponent implements OnInit {

  auth: Observable<fromAuth.State>;
  user: User;
  unreadMessages: number;
  language = new FormControl();

  constructor(
    private store: Store<fromApp.AppState>,
    private authService: AuthService,
    private appService: AppService,
    private langService: LangService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.store.select('authState').subscribe(p => {
      this.user = p.user;
    });
    this.store.select('roomState').subscribe(p => {
      if(p) this.unreadMessages = p.unreadMessages;
    });
    this.language.setValue(this.langService.language);
    this.language.valueChanges.subscribe(p => {
      this.langService.changeLanguage(p);
      this.cdr.detectChanges();
    });

  }

  toggleLeftMenu() {
    this.store.dispatch(new AppAction.ToggleLeftNav());
  }

  logOut() {
    this.authService.logoutUser();
  }

  getEvents() {
    this.appService.resetEvents(EventListType.All);
  }

  get smallScreen() {
    return this.appService.smallScreen;
  }

  report(user?: User) {
    let data = {
      type: FeedbackTypes.report,
      ownerUser: this.user
    }
    const dialogRef = this.dialog.open(NewFeedbackComponent, {
      minWidth: '250px',
      maxWidth: '600px',
      data
    });
    dialogRef.afterClosed().subscribe(result => { });
  }

  get languages() {
    return this.langService.languages;
  }

  changeLanguage(language: Languages) {
    this.language.setValue(language);
    this.cdr.detectChanges();
  }


}
