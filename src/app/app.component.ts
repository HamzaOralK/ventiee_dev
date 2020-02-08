import { Component, OnInit, OnDestroy } from '@angular/core';
import { Room } from './dtos/room';
import { User } from './dtos/user';
import { UserService } from './services/dataServices/user-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'mitap';
    subscription = new Subscription();

    constructor(private userService: UserService) { }

    ngOnInit() {
        let userSubscription = this.userService.getUser();
    }

    ngOnDestroy() { }
}
