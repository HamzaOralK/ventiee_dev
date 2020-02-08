import { User } from './user';
import { Room } from './room';

export class MMessage {
    id:string;
    user: User;
    date: Date;
    message: string;
    event: Event;
    room: Room;
}