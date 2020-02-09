import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'left-navigation',
  templateUrl: './left-navigation.component.html',
  styleUrls: ['./left-navigation.component.scss']
})
export class LeftNavigationComponent implements OnInit, AfterViewInit {
    @ViewChild('drawer', {static: false}) drawer: MatSidenav;

    appWise: Observable<fromApp.AppWise>

    constructor(
        private cdr: ChangeDetectorRef, 
        private store: Store<fromApp.AppState>
    ) { }

    ngOnInit() {
        this.appWise = this.store.select('appWise');
    }

    ngAfterViewInit() {
        this.cdr.detectChanges();
    }

}
