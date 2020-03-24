import { User } from './user';
import { MMessage } from './message';
import { Event } from './event';

export class Room extends Event {
  users: User[];
  messages: MMessage[];
}
