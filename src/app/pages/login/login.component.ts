import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/dtos/user';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
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
