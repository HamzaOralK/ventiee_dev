import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/dtos/user';
import { Event } from 'src/app/dtos/event';
import { Subscription } from 'rxjs';
import { CommentsService } from 'src/app/services/dataServices/comments/comments.service';
import { NotificationService, SnackType } from 'src/app/services/notification/notification.service';
import { MultiLanguagePipe } from 'src/app/shared/pipes/multi-language.pipe';

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
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<NewCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {event: Event, user: User},
    private commentsService: CommentsService,
    private notificationService: NotificationService,
    private mlPipe: MultiLanguagePipe
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
    let commentObj: Partial<{eventId: string, moderatorUserId: string, userId: string, comment: string, rating: number, date: Date}> = {};
    commentObj.eventId = this.data.event._id;
    commentObj.moderatorUserId = this.data.event.moderatorUserId;
    commentObj.userId = this.data.user._id;
    commentObj.comment = this.comment.value.trim();
    commentObj.rating = this.rating;
    commentObj.date = new Date();
    this.isLoading = true;
    this.commentsService.sendComment(commentObj).subscribe(p => {
      this.isLoading = false;
      this.notificationService.notify(this.mlPipe.transform('commentSaved'), SnackType.default);
      this.onNoClick();
    },
    e => {
      this.isLoading = false;
      this.notificationService.notify(this.mlPipe.transform('commentError'), SnackType.warn);
      this.onNoClick();
    });
  }

  checkCommentValidation() {
    return !(this.rating !== undefined && this.comment.valid);
  }

}
