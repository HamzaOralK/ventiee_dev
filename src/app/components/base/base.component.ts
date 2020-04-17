import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  activatedRoute: ActivatedRoute;

  constructor(private injector: Injector) {
    this.activatedRoute = this.injector.get(ActivatedRoute);
  }

  ngOnInit(): void {
    this.subscription = new Subscription();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
