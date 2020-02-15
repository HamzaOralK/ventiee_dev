import * as AppActions from './app.actions';
import * as fromAuth from '../services/auth/store/auth.reducer';
import { ActionReducerMap } from '@ngrx/store';
import { Event } from '../dtos/event';

export interface AppState {
  appWise: AppWise;
  authState ? : fromAuth.State;
}

export const appReducer: ActionReducerMap < AppState > = {
  appWise: appWiseReducer,
  authState: fromAuth.authReducer
}

export interface AppWise {
  leftNavigationOpen: boolean,
  roomNavigationOpen: boolean,
  events: Event[]
};

export const initialState: AppWise = {
  leftNavigationOpen: false,
  roomNavigationOpen: false,
  events: []
}

export function appWiseReducer(state = initialState, action: AppActions.AppActions) {
  switch (action.type) {
    case AppActions.TOGGLE_LEFT_NAV:
      let leftNavState: boolean;
      if(action.payload !== undefined) leftNavState = action.payload;
      else leftNavState = !state.leftNavigationOpen;
      return {
        ...state,
        leftNavigationOpen: leftNavState
      };
    case AppActions.TOGGLE_ROOM_NAV:
      return {
        ...state,
        roomNavigationOpen: !state.roomNavigationOpen
      };
    case AppActions.GET_EVENTS:
      return {
        ...state,
        events: [...action.payload]
      }
    case AppActions.ADD_EVENT:
      return {
        ...state,
        events: [...state.events, action.payload]
      }
    default:
      return state;
  }
}
