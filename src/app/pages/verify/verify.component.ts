import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from 'src/app/components/base/base.component';

@Component({
  selector: 'verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent extends BaseComponent implements OnInit {

  hash: string;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    let routeSubscription = this.activatedRoute.paramMap.subscribe(p => {
      this.hash = p.get('hash');
      this.authService.verifyUser(this.hash);
    });
    this.subscription.add(routeSubscription);
  }
}

