import { User } from './user';
import { MMessage } from './message';
import { Event } from './event';

export class Room extends Event {
  users: RoomUser[];
  messages: MMessage[];
}

export class RoomUser {
  eventId?: string;
  user: Partial<User>;
  joinDate?: Date;
  color?: Color;
}


export class Color {
  constructor(public r: number, public g: number, public b: number, public a: number) { }
}

