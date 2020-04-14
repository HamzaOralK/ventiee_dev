import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'users-comments',
  templateUrl: './users-comments.component.html',
  styleUrls: ['./users-comments.component.scss']
})

export class UsersCommentsComponent implements OnInit {

  @Input() userComments: Comment[];

  constructor() { }

  ngOnInit(): void { }

}
