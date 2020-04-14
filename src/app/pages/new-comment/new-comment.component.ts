import { Component, OnInit } from '@angular/core';

@Component({
  selector: "new-comment",
  templateUrl: "./new-comment.component.html",
  styleUrls: ["./new-comment.component.scss"],
})
export class NewCommentComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  onRate(event) {
    console.log(event);
  }
}
