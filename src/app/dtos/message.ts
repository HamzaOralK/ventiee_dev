import { User } from './user';
import { Room } from './room';

export class MMessage {
    _id:string;
    user: User;
    date: Date;
    message: string;
    event: Event;
    room: Room;
}