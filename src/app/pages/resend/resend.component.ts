import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from 'src/app/components/base/base.component';
import { Router } from '@angular/router';

@Component({
  selector: 'resend',
  templateUrl: './resend.component.html',
  styleUrls: ['./resend.component.scss']
})
export class ResendComponent extends BaseComponent implements OnInit {

  email: string = '';

  constructor(injector: Injector, private router: Router) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    let routeSubscription = this.activatedRoute.paramMap.subscribe(p => {
      this.email = p.get('user');
      if(this.email) this.resendEmail();
      else this.router.navigate(['/home']);
    });
    this.subscription.add(routeSubscription);
  }

  resendEmail(event?) {
    if(event) event.preventDefault();
    let authSubscription = this.authService.resend({email: this.email, language:"tr"})
    this.subscription.add(authSubscription);
  }

}
