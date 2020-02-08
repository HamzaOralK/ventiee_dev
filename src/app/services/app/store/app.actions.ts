import { Action } from '@ngrx/store';
import { User } from 'src/app/dtos/user';

export const TOGGLE_SIDE_NAV = 'TOGGLE_SIDE_NAV';
export const SET_USER = 'SET_USER';

export class ToggleSideNav implements Action {
    readonly type = TOGGLE_SIDE_NAV;
    //payload: boolean;
    constructor() { }
}

export class SetUser implements Action {
    readonly type = SET_USER;
    constructor(public payload: User) {}
}

export type AppActions = ToggleSideNav | SetUser;