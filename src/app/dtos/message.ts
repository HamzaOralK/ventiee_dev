import { User } from './user';
import { Room } from './room';

export class Message {
    id:string;
    user: User;
    date: Date;
    message: string;
    event: Event;
    room: Room;
}