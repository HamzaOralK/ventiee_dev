import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/dtos/user';
import { Router } from '@angular/router';

@Component({
  selector: 'sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.scss']
})
export class SignUpFormComponent implements OnInit {
  unamePattern = "^[a-zA-Z]{1,}[a-zA-Z0-9_]+[0-9]*$";
  // 1 büyükharf, 1 küçükharf, 1 sayı, minimum 8 karakter
  passwordPattern = '^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$';

  signUp = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    surname: new FormControl('', [Validators.required, Validators.minLength(2)]),
    nickname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(10), Validators.pattern(this.unamePattern)]),
    password: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)])
  })

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  get signUpControls(): any {
    return this.signUp['controls'];
  }

  onSubmit() {
    let user = new User();
    user.name = this.signUp.value.name;
    user.surname = this.signUp.value.surname;
    user.nickname = this.signUp.value.nickname;
    user.email = this.signUp.value.email;
    user.password = this.signUp.value.password;
    user.language = 'tr';
    this.authService.signUp(user).subscribe(p => {
      if(p["code"] === 200) {
        this.router.navigate(['/home']);
      }
    });
  }

}
