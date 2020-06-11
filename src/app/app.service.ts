import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AppAction from './store/app.actions';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { GenericModalComponent, ModalType } from './components/generic-modal/generic-modal.component';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  smallScreen: boolean;
  s_smallScreen: BehaviorSubject<boolean> = new BehaviorSubject(true);

  _loading: boolean;
  s_loading: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private store: Store<fromApp.AppState>,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog
  ) {

    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
    ]).subscribe(result => {
      this.s_smallScreen.next(result.matches);
    });

    this.s_smallScreen.subscribe(p => {
      this.smallScreen = p;
    })
  }

  set loading(loading) {
    this._loading = loading;
    this.s_loading.next(loading);
  }

  openNav() {
    if(this.smallScreen) this.store.dispatch(new AppAction.ToggleLeftNav(true));
  }

  closeNav() {
    this.store.dispatch(new AppAction.ToggleLeftNav(false));
  }

  openModal(title: string, description: string, htmlTemplate: string, type: ModalType) {
    const dialogRef = this.dialog.open(GenericModalComponent, {
      data: { htmlTemplate, title, description }
    });
    if(type === ModalType.Confirmation) return dialogRef.afterClosed()
  }

}
