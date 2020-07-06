import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/dtos/user';
import { Router } from '@angular/router';
// import { MatDialog } from '@angular/material/dialog';
// import { GenericModalComponent } from '../generic-modal/generic-modal.component';
import { eula_tr } from "src/assets/eula-tr";
import { AppService } from 'src/app/app.service';
import { ModalType } from '../generic-modal/generic-modal.component';
import { Languages } from 'src/app/dtos/languages';

@Component({
  selector: 'sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.scss']
})
export class SignUpFormComponent implements OnInit {
  unamePattern = "^[a-zA-Z]{1,}[a-zA-Z0-9_]+[0-9]*$";
  showPassword: boolean = false;

  signUp = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    surname: new FormControl('', [Validators.required, Validators.minLength(2)]),
    nickname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(10), Validators.pattern(this.unamePattern)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
    language: new FormControl('tr', [Validators.required]),
    eulaStatus: new FormControl(false, [Validators.requiredTrue]),
    plus18: new FormControl(false, [Validators.requiredTrue])
  })

  constructor(
    private authService: AuthService,
    private router: Router,
    private appService: AppService
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
    user.email = (this.signUp.value.email as string).toLowerCase();
    user.password = this.signUp.value.password;
    user.language = 'tr';
    this.authService.signUp(user).subscribe(p => {
      if(p["code"] === 200) {
        this.router.navigate(['/home']);
      }
    });
  }

  changeShowPassword() {
    this.showPassword = !this.showPassword;
  }

  openModal(){
    this.appService.openModal('eula', undefined, eula_tr, ModalType.Information);
  }

  get languages() {
    return Languages;
  }

}
