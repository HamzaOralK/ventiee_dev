import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LangService } from 'src/app/services/lang/lang.service';

@Component({
  selector: 'base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  activatedRoute: ActivatedRoute;
  authService: AuthService;
  langService: LangService;

  constructor(private injector: Injector) {
    this.activatedRoute = this.injector.get(ActivatedRoute);
    this.authService = this.injector.get(AuthService);
    this.langService = this.injector.get(LangService);
  }

  ngOnInit(): void {
    this.subscription = new Subscription();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
