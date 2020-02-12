import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/dtos/user';

@Component({
  selector: 'sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.scss']
})
export class SignUpFormComponent implements OnInit {
  signUp = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required, Validators.min(2)])
  })

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void { }

  get signUpControls(): any {
    return this.signUp['controls'];
  }

  onSubmit() {
    let user = new User();
    user.name = this.signUp.value.name;
    user.email = this.signUp.value.email;
    this.authService.signUp(user).subscribe(p => console.log(p));
  }

}
