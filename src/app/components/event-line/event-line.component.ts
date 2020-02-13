import { Component, OnInit, Input } from '@angular/core';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Event } from 'src/app/dtos/event';

@Component({
  selector: 'event-line',
  templateUrl: './event-line.component.html',
  styleUrls: ['./event-line.component.scss']
})
export class EventLineComponent implements OnInit {

  appWise: Observable<fromApp.AppWise>

  @Input() event: Event;

  constructor( ) { }

  ngOnInit(): void { }

}
