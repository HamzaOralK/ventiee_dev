import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from 'src/app/components/base/base.component';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent extends BaseComponent implements OnInit {
  email: string = '';

  constructor(injector: Injector) {
    super(injector);
  }

  forgotPassword(event?) {
    if (event) event.preventDefault();
    let authSubscription = this.authService.sendForgotMail({ email: this.email })
    this.subscription.add(authSubscription);
  }
}
