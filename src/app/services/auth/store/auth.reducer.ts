import * as AuthActions from './auth.actions';
import { User } from 'src/app/dtos/user';

export interface State {
    user: User;
}

const initialState: State = {
    user: undefined
}

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
    switch (action.type) {
        case AuthActions.LOGIN_USER:
            console.log({
                ...state,
                user: action.payload
            });
            return {
                ...state,
                user: action.payload
            }
        default:
            return state;
    }
}