import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/dtos/user';
import { Observable } from 'rxjs';
import * as fromAuth from '../../services/auth/store/auth.reducer';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { BaseComponent } from '../base/base.component';

export enum LoginError {
  NotVerified = 'NotVerified',
  LoginError = 'LoginError'
}

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent extends BaseComponent implements OnInit, OnDestroy {

  auth: Observable<fromAuth.State>;
  error: LoginError;
  showPassword: boolean = false;

  login = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  })
  constructor(
    injector: Injector,
    private store: Store<fromApp.AppState>
  ) {
    super(injector);
    this.auth = this.store.select('authState');
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  get loginControls(): any {
    return this.login['controls'];
  }

  async onSubmit() {
    let user = new User();
    user.email = this.login.value.email;
    user.password = this.login.value.password;
    let loginSubscription = this.authService.loginUser(user).subscribe(p => {
      if(p === LoginError.LoginError) {
        this.error = LoginError.LoginError;
      } else if (p === LoginError.NotVerified) {
        this.error = LoginError.NotVerified
      }
    });
    this.subscription.add(loginSubscription);
  }

  changeShowPassword() {
    this.showPassword = !this.showPassword;
  }

}
