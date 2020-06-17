import { Component, OnInit, Input } from '@angular/core';
import { UserComment } from 'src/app/dtos/user';

@Component({
  selector: 'users-comments',
  templateUrl: './users-comments.component.html',
  styleUrls: ['./users-comments.component.scss']
})

export class UsersCommentsComponent implements OnInit {

  @Input() userComments: UserComment[];

  constructor() { }

  ngOnInit(): void { }

}
