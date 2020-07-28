import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/dtos/user';
import { Router } from '@angular/router';
import { eula_tr } from "src/assets/eula-tr";
import { privacy_tr } from "src/assets/privacy-tr";
import { AppService } from 'src/app/app.service';
import { ModalType } from '../generic-modal/generic-modal.component';
import { LangService } from 'src/app/services/lang/lang.service';
import { SocialAuthService, FacebookLoginProvider } from 'angularx-social-login';


export const enum SignUpType {
  Social = 'social',
  Normal = 'normal'
};
@Component({
  selector: "sign-up-form",
  templateUrl: "./sign-up-form.component.html",
  styleUrls: ["./sign-up-form.component.scss"],
})
export class SignUpFormComponent implements OnInit {
  unamePattern = "^[a-zA-Z]{1,}[a-zA-Z0-9_]+[0-9]*$";
  showPassword: boolean = false;
  signUpType: SignUpType;

  signUp = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    name: new FormControl("", [Validators.required, Validators.minLength(2)]),
    surname: new FormControl("", [
      Validators.required,
      Validators.minLength(2),
    ]),
    nickname: new FormControl("", [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(15),
      Validators.pattern(this.unamePattern),
    ]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
    language: new FormControl("tr", [Validators.required]),
    privacyStatus: new FormControl(false, [Validators.requiredTrue]),
    eulaStatus: new FormControl(false, [Validators.requiredTrue]),
    emailNotification: new FormControl(false),
    plus18: new FormControl(false, [Validators.requiredTrue]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private appService: AppService,
    private langService: LangService,
    private socialAuthService: SocialAuthService
  ) {}

  ngOnInit(): void {}

  get signUpControls(): any {
    return this.signUp["controls"];
  }

  onSubmit() {
    let user = new User();
    user.name = this.signUp.value.name;
    user.surname = this.signUp.value.surname;
    user.nickname = this.signUp.value.nickname;
    user.email = (this.signUp.value.email as string).toLowerCase();
    user.password = this.signUp.value.password;
    user.language = "tr";
    this.authService.signUp(user).subscribe((p) => {
      if (p["code"] === 200) {
        this.router.navigate(["/home"]);
      }
    });
  }

  changeShowPassword() {
    this.showPassword = !this.showPassword;
  }

  openModal(type: string) {
    if (type === "eula")
      this.appService.openModal(
        "eula",
        undefined,
        eula_tr,
        ModalType.Information
      );
    if (type === "privacy")
      this.appService.openModal(
        "privacy",
        undefined,
        privacy_tr,
        ModalType.Information
      );
  }

  get language() {
    return this.langService.language;
  }

  get languages() {
    return this.langService.languages;
  }

  signUpWithFB(): void {

    this.signUpType = SignUpType.Social;

    this.authService.signInWithFB()
      .then((p) => {
        if (p.name) this.signUp.controls["name"].setValue(p.name);
        if (p.lastName) this.signUp.controls["surname"].setValue(p.lastName);
        if (p.email) this.signUp.controls["email"].setValue(p.email);
      });
  }

  signUpWithOutFb() {
    this.signUpType = SignUpType.Normal;
  }
}
