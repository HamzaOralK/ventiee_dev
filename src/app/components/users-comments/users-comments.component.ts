import { Component, OnInit, Input } from '@angular/core';
import { EventComment } from 'src/app/dtos/event';

@Component({
  selector: 'users-comments',
  templateUrl: './users-comments.component.html',
  styleUrls: ['./users-comments.component.scss']
})

export class UsersCommentsComponent implements OnInit {

  @Input() userComments: EventComment[];

  constructor() { }

  ngOnInit(): void { }

}
