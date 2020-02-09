import * as AppActions from './app.actions';
import * as fromAuth from '../services/auth/store/auth.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
    appWise: AppWise;
    authState?: fromAuth.State;
}


export const appReducer: ActionReducerMap<AppState> = {
    appWise: appWiseReducer,
    authState: fromAuth.authReducer
}


export interface AppWise {
    leftNavigationOpen: boolean
};

export const initialState: AppWise = {
    leftNavigationOpen: false
}

export function appWiseReducer(state = initialState, action: AppActions.AppActions) {
    switch(action.type) {
        case AppActions.TOGGLE_SIDE_NAV:
            return {
                ...state, 
                leftNavigationOpen: !state.leftNavigationOpen
            };
            default: 
            return state;
    }
}
