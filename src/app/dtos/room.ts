import { User } from './user';

export class Room {
    id: string;
    eventId: string;
    users: User[];
    moderator: User;
}