import { Action } from '@ngrx/store';
import { User } from 'src/app/dtos/user';

export const LOGIN_USER = 'LOGIN_USER';

export class LoginUser implements Action {
    readonly type = LOGIN_USER;
    constructor(public payload: User) { }
}

export type AuthActions = LoginUser;