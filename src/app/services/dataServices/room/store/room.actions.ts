import { Action } from '@ngrx/store';
import { MMessage } from '../../../../dtos/message';
import { Room } from '../../../../dtos/room';
import { User } from 'src/app/dtos/user';

export const SEND_MESSAGE = 'SEND_MESSAGE';
export const GET_MESSAGE = 'GET_MESSAGE';
export const LOAD_MESSAGES = 'LOAD_MESSAGES';
export const JOIN_ROOM = 'JOIN_ROOM';
export const INSERT_USER = 'INSERT_USER';
export const GET_ROOMS = 'GET_ROOMS';
export const QUIT_ROOM = 'QUIT_ROOM';
export const KICK_USER = 'KICK_USER';
export const LEAVE_ROOM = 'LEAVE_ROOM';
export const CHANGE_ACTIVE_ROOM = 'CHANGE_ACTIVE_ROOM';
export const SET_ROOM_USERS = 'SET_ROOM_USERS';


export class SendMessage implements Action {
  readonly type = SEND_MESSAGE;
  constructor(public payload: { room: Room, user: User, message?: MMessage[] }) { }
}

export class GetMessage implements Action {
  readonly type = GET_MESSAGE;
  constructor(public payload: { room: Room, messages?: MMessage }) { }
}

export class LoadMessages implements Action {
  readonly type = LOAD_MESSAGES;
  constructor(public payload: { room: Room, messages?: MMessage[] }) { }
}

export class GetRooms implements Action {
  readonly type = GET_ROOMS;
  constructor(public payload: { rooms: Room[] }) { }
}

export class JoinRoom implements Action {
  readonly type = JOIN_ROOM;
  constructor(public payload: { room: Room }) { }
}

export class InsertUser implements Action {
  readonly type = INSERT_USER;
  constructor(public payload: { roomId: string, user: User }) { }
}

export class LeaveRoom implements Action {
  readonly type = LEAVE_ROOM;
  constructor(public payload: { room: Partial<Room> }) { }
}

export class KickUser implements Action {
  readonly type = KICK_USER;
  constructor(public payload: { room: Room, userId?: string }) { }
}

export class ChangeActiveRoom implements Action {
  readonly type = CHANGE_ACTIVE_ROOM;
  constructor(public payload: { roomId: string }) { }
}

export class SetRoomUsers implements Action {
  readonly type = SET_ROOM_USERS;
  constructor(public payload: { room: Room, users: User[] }) { }
}

export type RoomActions = SendMessage | GetMessage | LoadMessages | GetRooms | JoinRoom | LeaveRoom |
            KickUser | ChangeActiveRoom | SetRoomUsers | InsertUser;
