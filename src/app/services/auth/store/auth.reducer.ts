import * as AuthActions from './auth.actions';
import { User } from 'src/app/dtos/user';

export interface State {
    user: User;
    token: string;
}

const initialState: State = {
    user: undefined,
    token: undefined
}

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
    switch (action.type) {
        case AuthActions.LOGIN_USER:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token
            }
        case AuthActions.LOGOUT_USER:
            return {
                ...state,
                user: undefined,
                token: undefined
            }
        default:
            return state;
    }
}