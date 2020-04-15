import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/dataServices/user/user.service';
import { User } from 'src/app/dtos/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Gender, SchoolType } from 'src/app/dtos/enums';
import { COMMONS } from 'src/app/shared/commons';

@Component({
  selector: 'user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  user_id:string;
  user: User;
  genders: any;
  schoolTypes: any;

  profileForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.min(2)]),
    surname: new FormControl('', [Validators.required, Validators.min(2)]),
    emailNotification: new FormControl(false),
    nickname: new FormControl('', [Validators.required, Validators.min(3)]),
    description: new FormControl('', [Validators.max(140)]),
    birthday: new FormControl(),
    gender: new FormControl(),
    preferedGender: new FormControl(),
    schoolType: new FormControl(),
    school: new FormControl()
  });

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(p => {
      this.user_id = p.get('id');
      this.userService.getUserById(p.get('id')).subscribe(user => {
        this.user = user;
        this.profileForm.patchValue(this.user);
      });
    });
    this.genders = COMMONS.getEnumArray(Gender);
    this.schoolTypes = COMMONS.getEnumArray(SchoolType);
  }

  submit(event) {
    event.preventDefault();
    this.userService.updateUserById(this.user_id, this.profileForm.value).subscribe(p => {
      /** TODO: Change whole user with settings update. */
    });
  }

}
