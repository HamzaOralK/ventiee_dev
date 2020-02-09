import { User } from '../dtos/user';

export interface AppState {
    leftNavigationOpen: boolean
    user?: User
};