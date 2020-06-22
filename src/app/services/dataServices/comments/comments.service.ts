import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as fromAuth from '../../auth/store/auth.reducer';
import * as fromApp from '../../../store/app.reducer';
import { Observable } from 'rxjs';
import { User } from 'src/app/dtos/user';
import { environment } from 'src/environments/environment';

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
    return this.http.post<any>(url, {...commentObj});
  }

  getCommentsByEventId(eventId: string) {

  }

  getCommentsByModeratorUserId(moderatorUserId) {
    let url = environment.serviceURL + "/comments";
    return this.http.post(url, { moderatorUserId });
  }
}
