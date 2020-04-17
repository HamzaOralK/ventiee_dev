import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/components/base/base.component';

@Component({
  selector: 'resend',
  templateUrl: './resend.component.html',
  styleUrls: ['./resend.component.scss']
})
export class ResendComponent extends BaseComponent implements OnInit {

  email: string = '';

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    let routeSubscription = this.activatedRoute.paramMap.subscribe(p => {
      this.email = p.get('user');
    });
    this.subscription.add(routeSubscription);
  }

  resendEmail(event) {
    event.preventDefault();
    console.log(this.email);
  }

}
