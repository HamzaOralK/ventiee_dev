import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/dataServices/user/user.service';
import { User } from 'src/app/dtos/user';
import { Event } from '../../../dtos/event';
import { Gender } from 'src/app/dtos/enums';
import { CommentsService } from 'src/app/services/dataServices/comments/comments.service';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit, OnDestroy {

  user: User = undefined;
  commentedEvents: Event[] = undefined;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private commentsService: CommentsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(p => {
      this.userService.getUserById(p.get('id')).toPromise()
      .then(p => {
        this.user = p;
        return p;
      })
      .then(user => {
        this.commentsService.getCommentsByModeratorUserId(user._id).toPromise().then((p: Event[]) => {
          let newCommentedEvents = p.map(e => {
            if(e["comment"]) {
              e.comments = e["comment"];
              delete e["comment"];
            }
            if(e.comments.length > 0) {
              return e;
            }
          });
          this.commentedEvents = newCommentedEvents.filter(e => e !== undefined);
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.user = undefined;
  }

  get genders() {
    return Gender;
  }

  get isClient() {
    return this.user._id === this.authService.user._id;
  }



}
