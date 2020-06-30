import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as fromAuth from '../../auth/store/auth.reducer';
import * as fromApp from '../../../store/app.reducer';
import * as AppActions from '../../../store/app.actions';
import { Observable } from 'rxjs';
import { User } from 'src/app/dtos/user';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  auth: Observable<fromAuth.State>;
  user: User;

  constructor(
    private http: HttpClient,
    private store: Store<fromApp.AppState>,
  ) {
    this.auth = this.store.select("authState");
    this.auth.subscribe(p => {
      if (p.user) {
        this.user = p.user;
      }
    })
  }

  sendComment(commentObj: Partial<{ eventId: string, moderatorUserId: string, userId: string, comment: string, rating: number, date: Date }>) {
    let url = environment.serviceURL + "/comment/add";
    return this.http.post<any>(url, {...commentObj}).pipe(
      map(c => {
        this.store.dispatch(new AppActions.CommentHistoryEvent({commentObj, eventId: commentObj.eventId}));
      })
    );
  }

  sendReport(reportObj: Partial<{ eventId: string, moderatorUserId: string, userId: string, ownerUserId: string, description: string, date: Date }>) {
    let url = environment.serviceURL + "/report/add";
    return this.http.post<any>(url, { ...reportObj })
  }

  getCommentsByEventId(eventId: string) { }

  getCommentsByModeratorUserId(moderatorUserId) {
    let url = environment.serviceURL + "/comments";
    return this.http.post(url, { moderatorUserId });
  }
}
