import { Action } from '@ngrx/store';
import { Event } from '../dtos/event'
export const TOGGLE_LEFT_NAV = 'TOGGLE_LEFT_NAV';
export const TOGGLE_ROOM_NAV = 'TOGGLE_ROOM_NAV';
export const GET_EVENTS = 'GET_EVENTS';
export const LOAD_MORE_EVENTS = 'LOAD_MORE_EVENTS';
export const ADD_EVENT = 'ADD_EVENT';
export const FILTER_EVENT = 'FILTER_EVENT';

export class ToggleLeftNav implements Action {
  readonly type = TOGGLE_LEFT_NAV;
  constructor(public payload?: boolean) { }
}

export class ToggleRoomNav implements Action {
  readonly type = TOGGLE_ROOM_NAV;
  constructor() { }
}

export class GetEvents implements Action {
  readonly type = GET_EVENTS;
  constructor(public payload: Event[]) {}
}

export class LoadMoreEvents implements Action {
  readonly type = LOAD_MORE_EVENTS;
  constructor(public payload: Event[]) {}
}

export class AddEvent implements Action {
  readonly type = ADD_EVENT;
  constructor(public payload: Event) { }
}

export class FilterEvent implements Action {
  readonly type = FILTER_EVENT;
  constructor(public payload: Partial<Event>) { }
}

export type AppActions = ToggleLeftNav | ToggleRoomNav | GetEvents | LoadMoreEvents | AddEvent | FilterEvent;
