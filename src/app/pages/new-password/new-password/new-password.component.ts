import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from 'src/app/components/base/base.component';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';

const matchingPasswords: ValidatorFn = (fg: FormGroup) => {
  const newPassword = fg.get('newPassword').value;
  const newPasswordConfirm = fg.get('newPasswordConfirm').value;
  if (newPassword && newPasswordConfirm) {
    if (newPassword === newPasswordConfirm) {
      return null;
    } else {
      return { unmatchingPasswords: true };
    }
  }
  else {
    return null;
  }
  // return newPassword && newPasswordConfirm && newPassword === newPasswordConfirm ? { unmatchingPasswords: false } : { unmatchingPasswords: true };
}

@Component({
  selector: 'new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent extends BaseComponent implements OnInit {
  token: string;

  passwordChange: FormGroup = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
    newPasswordConfirm: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)])
  }, [matchingPasswords] )


  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    let routeSubscription = this.activatedRoute.paramMap.subscribe(p => {
      this.token = p.get('token');
    });
    this.subscription.add(routeSubscription);
  }

  get newPasswordControls(): any {
    return this.passwordChange['controls'];
  }

  newPassword(event) {
    if(event) event.preventDefault();
    this.authService.resetPassword(this.token, this.passwordChange.value['newPassword']);
  }

}
