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
  events: Event[]
};

export const initialState: AppWise = {
  leftNavigationOpen: false,
  events: []
}

export function appWiseReducer(state = initialState, action: AppActions.AppActions) {
  switch (action.type) {
    case AppActions.TOGGLE_SIDE_NAV:
      return {
        ...state,
        leftNavigationOpen: !state.leftNavigationOpen
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
