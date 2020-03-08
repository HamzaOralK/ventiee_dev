import { User } from './user';
import { MMessage } from './message';
import { RoomType } from './enums';

export class Room {
    _id: string;
    eventId: string;
    users: User[];
    messages: MMessage[];
    moderator?: User;
    roomType: RoomType
}
