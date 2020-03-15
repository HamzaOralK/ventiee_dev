import { User } from './user';

export class MMessage {
    _id:string;
    user: User;
    date: Date;
    message: string;
    event: Event;
    roomId: string;
    isRead: boolean;
}