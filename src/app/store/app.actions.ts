import { Action } from '@ngrx/store';

export const TOGGLE_SIDE_NAV = 'TOGGLE_SIDE_NAV';
export const GET_EVENTS = 'GET_EVENTS';
export const ADD_EVENT = 'ADD_EVENT';

export class ToggleSideNav implements Action {
    readonly type = TOGGLE_SIDE_NAV;
    //payload: boolean;
    constructor() { }
}

export class GetEvents implements Action {
    readonly type = GET_EVENTS;
    constructor(public payload: Event[]) {}
}

export class AddEvent implements Action {
    readonly type = ADD_EVENT;
    constructor(public payload: Event) { }
}

export type AppActions = ToggleSideNav | GetEvents | AddEvent;