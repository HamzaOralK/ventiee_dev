import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import * as fromRoom from '../../services/dataServices/room/store/room.reducer';
import * as fromApp from '../../store/app.reducer';
import { Observable } from 'rxjs/internal/Observable';
import { Store } from '@ngrx/store';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/internal/operators/take';

@Component({
  selector: 'app-chatting',
  templateUrl: './chatting.component.html',
  styleUrls: ['./chatting.component.scss']
})
export class ChattingComponent implements OnInit {

  rooms: Observable<fromRoom.State>;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(
    private store: Store<fromApp.AppState>,
    private _ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.rooms = this.store.select("roomState");
    this.rooms.subscribe(p => console.log(p));
  }

  triggerResize() {
    this._ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }
  sendMessage(event: InputEvent) {
    console.log((event.target as HTMLInputElement).value);
    (event.target as HTMLInputElement).value = "";
  }
  prevent(event: InputEvent) {
    event.preventDefault();
  }


}
