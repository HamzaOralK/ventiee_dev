import * as AppActions from './app.actions';
import * as fromAuth from '../services/auth/store/auth.reducer';
import * as fromRoom from '../services/dataServices/room/store/room.reducer';
import { ActionReducerMap } from '@ngrx/store';
import { Event } from '../dtos/event';

export interface AppState {
  appWise: AppWise;
  authState ?: fromAuth.State;
  roomState?: fromRoom.State;
}

export const appReducer: ActionReducerMap < AppState > = {
  appWise: appWiseReducer,
  authState: fromAuth.authReducer,
  roomState: fromRoom.roomReducer
}

export interface AppWise {
  leftNavigationOpen: boolean,
  roomNavigationOpen: boolean,
  events: Event[],
  history: Event[]
};

export const initialState: AppWise = {
  leftNavigationOpen: false,
  roomNavigationOpen: false,
  events: [],
  history: []
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
        events: action.payload
      }
    case AppActions.LOAD_MORE_EVENTS:
      return {
        ...state,
        events: [...state.events, ...action.payload]
      }
    case AppActions.GET_HISTORY_EVENTS:
      return {
        ...state,
        history: action.payload
      }
    case AppActions.LOAD_MORE_HISTORY_EVENTS:
      return {
        ...state,
        history: [...state.history, ...action.payload]
      }
    case AppActions.ADD_EVENT:
      return {
        ...state,
        events: [...state.events, action.payload]
      }
    case AppActions.FILTER_EVENT:
      return {
        ...state,
        events: state.events.filter(p => p._id !== action.payload._id)
      }
    case AppActions.ADD_HISTORY_EVENT:
      return {
        ...state,
        history: [action.payload, ...state.history]
      }
    default:
      return state;
  }
}
