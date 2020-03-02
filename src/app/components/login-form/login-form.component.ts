import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/dtos/user';
import { EventService } from 'src/app/services/dataServices/event/event-service.service';
import { Observable } from 'rxjs';
import * as fromAuth from '../../services/auth/store/auth.reducer';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  auth: Observable<fromAuth.State>;

  login = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.min(5)])
  })
  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {
    this.auth = this.store.select('authState');
  }

  ngOnInit(): void { }

  get loginControls(): any {
    return this.login['controls'];
  }

  async onSubmit() {
    let user = new User();
    user.email = this.login.value.email;
    user.password = this.login.value.password;
    this.authService.loginUser(user);
  }

}
