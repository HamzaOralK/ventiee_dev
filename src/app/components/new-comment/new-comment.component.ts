import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/dtos/user';
import { Event } from 'src/app/dtos/event';
import { Subscription } from 'rxjs';

@Component({
  selector: "new-comment",
  templateUrl: "./new-comment.component.html",
  styleUrls: ["./new-comment.component.scss"],
})
export class NewCommentComponent implements OnInit, OnDestroy {
  rating: number = undefined;
  comment: FormControl = new FormControl(undefined, [Validators.required, this.noWhitespace, Validators.maxLength(140), Validators.minLength(1)]);
  commentLength: number = 0;
  subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<NewCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {event: Event, user: User},
  ) {}

  ngOnInit(): void {
    let sub = this.comment.valueChanges.subscribe((p: string) => {
      this.commentLength = p.length;
    });
    this.subscription.add(sub);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public noWhitespace(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

  onRate(event) {
    this.rating = event;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  sendComment() {
    let commentObj: Partial<{eventId: string, moderatorUserId: string, fromUserId: string, comment: string, rating: number, date: Date}> = {};
    commentObj.eventId = this.data.event._id;
    commentObj.moderatorUserId = this.data.event.moderatorUserId;
    commentObj.fromUserId = this.data.user._id;
    commentObj.comment = this.comment.value.trim();
    commentObj.rating = this.rating;
    commentObj.date = new Date();
    console.log(commentObj);
  }

  checkCommentValidation() {
    return !(this.rating !== undefined && this.comment.valid);
  }

}
