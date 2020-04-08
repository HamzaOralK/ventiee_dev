import { Injectable } from '@angular/core';
import { User } from 'src/app/dtos/user';
import { CONFIG } from 'src/app/config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserById(id: string): Observable<User> {
    let url = CONFIG.serviceURL + '/user/get/' + id;
    return this.http.get<User>(url).pipe(catchError(err => {throw err}));
  }

  updateUserById(id: string, user: User) {
    let url = CONFIG.serviceURL + '/user/update/' + id;
    return this.http.post(url, user).pipe(catchError(err => {throw err}));
  }
}
