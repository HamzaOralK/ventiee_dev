import { Action } from '@ngrx/store';
import { User } from 'src/app/dtos/user';

export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

export class LoginUser implements Action {
    readonly type = LOGIN_USER;
    constructor(public payload: {token: string, user: User}) { }
}

export class LogoutUser implements Action {
    readonly type = LOGOUT_USER;
    constructor() { }
}

export type AuthActions = LoginUser | LogoutUser;