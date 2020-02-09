import * as AppActions from './app.actions';
import { AppState } from '../../state';

const initialState: AppState = {
    leftNavigationOpen: false
};

export function appReducer(state = initialState, action: AppActions.AppActions) {
    switch(action.type) {
        case AppActions.TOGGLE_SIDE_NAV:
            return {
                ...state, 
                leftNavigationOpen: !state.leftNavigationOpen
            };
        case AppActions.SET_USER:
            console.log("setuser");
            return {
                ...state, 
                user: action.payload
            }
        default: 
            return state;
    }
}