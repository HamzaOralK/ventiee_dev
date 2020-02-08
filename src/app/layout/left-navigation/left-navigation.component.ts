import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'left-navigation',
  templateUrl: './left-navigation.component.html',
  styleUrls: ['./left-navigation.component.scss']
})
export class LeftNavigationComponent implements OnInit, AfterViewInit {
    @ViewChild('drawer', {static: false}) drawer: MatSidenav;

    leftNavState: Observable<{ leftNavigationOpen: boolean }>

    constructor(
        private cdr: ChangeDetectorRef, 
        private store: Store<{ app: { leftNavigationOpen: boolean } }>
    ) { }

    ngOnInit() {
        this.leftNavState = this.store.select('app');
    }

    ngAfterViewInit() {
        this.cdr.detectChanges();
    }

}
