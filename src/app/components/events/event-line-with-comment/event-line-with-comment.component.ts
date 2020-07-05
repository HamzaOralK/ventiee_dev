import { Component, OnInit, Input } from '@angular/core';
import { Event } from 'src/app/dtos/event';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/dtos/user';
import { MatDialog } from '@angular/material/dialog';
import { NewFeedbackComponent } from '../../new-feedback/new-feedback.component';
import { FeedbackTypes } from 'src/app/dtos/enums';

@Component({
  selector: 'event-line-with-comment',
  templateUrl: './event-line-with-comment.component.html',
  styleUrls: ['./event-line-with-comment.component.scss']
})
export class EventLineWithCommentComponent implements OnInit {

  @Input() type: string;
  @Input() event: Event;
  smallScreen: boolean;
  user: User;

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.user = this.authService.user;
  }


  openCommentModal() {
    const dialogRef = this.dialog.open(NewFeedbackComponent, {
      minWidth: '250px',
      maxWidth: '600px',

      data: {
        event: this.event,
        user: this.user,
        type: FeedbackTypes.comment
      }
    });

    dialogRef.afterClosed().subscribe(result => { });
  }

  get comment() {
    if (this.event.comments && this.event.comments.length > 0) return this.event.comments[0];
    else return undefined;
  }

}
