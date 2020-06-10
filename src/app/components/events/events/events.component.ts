import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import { filter, throttleTime } from 'rxjs/operators';
import { EventService } from 'src/app/services/dataServices/event/event-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output('onJoinEvent') onJoinEvent = new EventEmitter();
  @Input() events: Event[];
  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  _isAll: boolean = false;
  _loading: boolean = false;
  subscription: Subscription;

  constructor(
    private scrollDispatcher: ScrollDispatcher,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.subscription = new Subscription();
  }

  ngAfterViewInit(): void {
    let sub = this.scrollDispatcher.scrolled().pipe(
      filter(event => this.virtualScroll.getRenderedRange().end === this.virtualScroll.getDataLength()),
      throttleTime(1000)
    ).subscribe(event => {
      if (!this._isAll) {
        this._loading = true;
        this.eventService.loadMoreEvents().subscribe((p) => {
          if (p.length === 0) {
            this._isAll = true;
          }
          this._loading = false;
        });
      }
    });
    this.subscription.add(sub);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onJoin($event) {
    this.onJoinEvent.emit($event);
  }

}
