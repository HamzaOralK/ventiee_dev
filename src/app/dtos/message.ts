import { RoomUser } from './room';

export class MMessage {
  _id:string;
  roomUser: Partial<RoomUser>;
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
