import { User } from './user';
import { MMessage } from './Message';
import { RoomType } from './enums';

export class Room {
    id: string;
    eventId: string;
    users: User[];
    messages: MMessage[];
    moderator: User;
    roomType: RoomType
}