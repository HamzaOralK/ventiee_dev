import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/dtos/user';
import { Event } from 'src/app/dtos/event';
import { Subscription } from 'rxjs';
import { CommentsService } from 'src/app/services/dataServices/comments/comments.service';
import { NotificationService, SnackType } from 'src/app/services/notification/notification.service';
import { FeedbackTypes } from 'src/app/dtos/enums';


@Component({
  selector: "new-feedback",
  templateUrl: "./new-feedback.component.html",
  styleUrls: ["./new-feedback.component.scss"],
})
export class NewFeedbackComponent implements OnInit, OnDestroy {
  rating: number = undefined;
  comment: FormControl = new FormControl(undefined, [this.noWhitespace, Validators.maxLength(140)]);
  commentLength: number = 0;
  subscription = new Subscription();
  isLoading = false;
  type: FeedbackTypes;

  constructor(
    public dialogRef: MatDialogRef<NewFeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { event: Event, user: User, type: FeedbackTypes, ownerUser: User}, //'comment' | 'report'
    private commentsService: CommentsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    let sub = this.comment.valueChanges.subscribe((p: string) => {
      this.commentLength = p.length;
    });
    this.subscription.add(sub);
    this.type = this.data.type;
    if (this.type === FeedbackTypes.report) this.comment.setValidators([Validators.required, this.noWhitespace, Validators.maxLength(140)]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public noWhitespace(control: FormControl) {
    let isWhitespace;
    if (control.value && control.value.length > 0) isWhitespace = (control.value || '').trim().length === 0;
    else isWhitespace = false;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

  onRate(event) {
    this.rating = event;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  sendFeedback() {
    let commentObj: Partial<{eventId: string, moderatorUserId: string, userId: string, comment: string, rating: number, date: Date, ownerUserId: string, description: string}> = {};
    if(this.data.event) {
      commentObj.eventId = this.data.event._id;
      commentObj.moderatorUserId = this.data.event.moderatorUserId;
    }
    if(this.data.user) commentObj.userId = this.data.user._id;
    if(this.data.ownerUser) commentObj.ownerUserId = this.data.ownerUser._id
    if(this.rating) commentObj.rating = this.rating;
    if(this.type === FeedbackTypes.comment) commentObj.comment = this.comment.value.trim();
    if(this.type === FeedbackTypes.report) commentObj.description = this.comment.value.trim();
    commentObj.date = new Date();
    this.isLoading = true;
    let postSub;
    if(this.type === FeedbackTypes.comment) {
      postSub = this.commentsService.sendComment(commentObj).subscribe(p => {
        this.isLoading = false;
        this.notificationService.notify('commentSaved', SnackType.default);
        this.onNoClick();
      },
      e => {
        this.isLoading = false;
        this.notificationService.notify('commentError', SnackType.warn);
        this.onNoClick();
      });
    } else if(this.type === FeedbackTypes.report) {
      postSub= this.commentsService.sendReport(commentObj).subscribe(p => {
        this.isLoading = false;
        this.notificationService.notify('reported', SnackType.default);
        this.onNoClick();
      }, e => {
          this.isLoading = false;
          this.notificationService.notify('reportedError', SnackType.warn);
          this.onNoClick();
      });
   }
   this.subscription.add(postSub);
  }

  checkFeedbackValidation() {
    if (this.type === FeedbackTypes.comment) return !(this.rating !== undefined && this.comment.valid);
    else if (this.type === FeedbackTypes.report) return !(this.comment.valid);
  }

}
