import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from 'src/app/components/base/base.component';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent extends BaseComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  forgotPassword(event?) {
    if (event) event.preventDefault();
    let authSubscription = this.authService.sendForgotMail({ email: this.email.value, language: this.langService.language});
    this.subscription.add(authSubscription);
  }


}
