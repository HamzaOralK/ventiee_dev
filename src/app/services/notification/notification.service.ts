import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export enum SnackType {
  default,
  warn
}

@Injectable({
  providedIn: "root"
})

export class NotificationService {
  constructor(private _snackBar: MatSnackBar) {}

  notify(message: string, type: SnackType = SnackType.default, action: string = "OK") {
    if(!action) action = "OK";
    let cPanel = ['ventiee-snackbar'];

    if(type === SnackType.warn) {
      cPanel = ['ventiee-snackbar-warn'];
    }

    this._snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'top',
      panelClass: cPanel,
    });
  }
}
