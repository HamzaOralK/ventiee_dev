import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/dataServices/user/user.service';
import { User } from 'src/app/dtos/user';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit, OnDestroy {

  user: User = undefined;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(p => {
      this.userService.getUserById(p.get('id')).subscribe(p => {
        this.user = p;
      });
    });
  }

  ngOnDestroy(): void {
    this.user = undefined;
  }

}
