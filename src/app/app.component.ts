import { Component, OnInit } from '@angular/core';
import { Room } from './dtos/room';
import { User } from './dtos/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mitap';

  ngOnInit() { }
}
