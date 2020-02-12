import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/dtos/user';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  login = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.min(5)])
  })
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void { }

  get loginControls(): any {
    return this.login['controls'];
  }

  onSubmit() {
    let user = new User();
    user.email = this.login.value.email;
    this.authService.loginUser(user.email);
  }
}
