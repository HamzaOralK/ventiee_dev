import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'password-form-element',
  templateUrl: './password-form-element.component.html',
  styleUrls: ['./password-form-element.component.scss']
})
export class PasswordFormElementComponent implements OnInit {

  showPassword: boolean = false;


  @Input() formControl: FormControl;
  @Input() title: string = 'password';

  constructor() { }

  ngOnInit(): void { }

  changeShowPassword() {
    this.showPassword = !this.showPassword;
  }

}
