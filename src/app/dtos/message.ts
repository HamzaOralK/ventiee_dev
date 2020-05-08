import { User } from './user';

export class MMessage {
  _id:string;
  user: Partial<User>;
  date: Date;
  message: string;
  event: Event;
  eventId: string;
  isRead: boolean;
  type: MessageType;
}


export enum MessageType {
  Message,
  NewUser,
  LeaveRoom,
  KickUser
}
