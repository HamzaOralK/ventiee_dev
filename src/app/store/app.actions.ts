import { Action } from '@ngrx/store';

export const TOGGLE_SIDE_NAV = 'TOGGLE_SIDE_NAV';

export class ToggleSideNav implements Action {
    readonly type = TOGGLE_SIDE_NAV;
    //payload: boolean;
    constructor() { }
}

export type AppActions = ToggleSideNav;