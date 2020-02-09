import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/dtos/user';
import { UserService } from 'src/app/services/dataServices/user-service.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
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
