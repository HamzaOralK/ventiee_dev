import { Action } from '@ngrx/store';
import { MMessage } from '../../../../dtos/message';
import { Room, RoomUser } from '../../../../dtos/room';

export const SEND_MESSAGE = 'SEND_MESSAGE';
export const GET_MESSAGE = 'GET_MESSAGE';
export const LOAD_MESSAGES = 'LOAD_MESSAGES';
export const BUG_LOAD_MESSAGES = 'BUG_LOAD_MESSAGES';
export const JOIN_ROOM = 'JOIN_ROOM';
export const INSERT_USER = 'INSERT_USER';
export const GET_ROOMS = 'GET_ROOMS';
export const QUIT_ROOM = 'QUIT_ROOM';
export const KICK_USER = 'KICK_USER';
export const LEAVE_ROOM = 'LEAVE_ROOM';
export const CHANGE_ACTIVE_ROOM = 'CHANGE_ACTIVE_ROOM';
export const SET_ROOM_USERS = 'SET_ROOM_USERS';
export const RESET_ROOM_UNREAD_COUNT = 'RESET_ROOM_UNREAD_COUNT';
export const SET_ACTIVE_ROOM_UNDEFINED = 'SET_ACTIVE_ROOM_UNDEFINED';
export const UPDATE_ROOM_INFO = 'UPDATE_ROOM_INFO';


export class SendMessage implements Action {
  readonly type = SEND_MESSAGE;
  constructor(public payload: { room: Room, roomUser: RoomUser, message?: MMessage[] }) { }
}

export class GetMessage implements Action {
  readonly type = GET_MESSAGE;
  constructor(public payload: { room: Room, messages?: MMessage }) { }
}

export class LoadMessages implements Action {
  readonly type = LOAD_MESSAGES;
  constructor(public payload: { room: Room, messages?: MMessage[] }) { }
}

export class BugLoadMessages implements Action {
  readonly type = BUG_LOAD_MESSAGES;
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
  constructor(public payload: { roomId: string, roomUser: RoomUser }) { }
}

export class LeaveRoom implements Action {
  readonly type = LEAVE_ROOM;
  constructor(public payload: { room: Partial<Room> }) { }
}

export class KickUser implements Action {
  readonly type = KICK_USER;
  constructor(public payload: { room: Room, roomUserId?: string }) { }
}

export class ChangeActiveRoom implements Action {
  readonly type = CHANGE_ACTIVE_ROOM;
  constructor(public payload: { roomId: string }) { }
}

export class SetRoomUsers implements Action {
  readonly type = SET_ROOM_USERS;
  constructor(public payload: { room: Room, roomUsers: RoomUser[] }) { }
}

export class ResetRoomUnreadCount implements Action {
  readonly type = RESET_ROOM_UNREAD_COUNT;
  constructor(public payload: { room: Room }) { }
}

export class SetActiveRoomUndefined implements Action {
  readonly type = SET_ACTIVE_ROOM_UNDEFINED;
  constructor() { }
}

export class UpdateRoomInfo implements Action {
  readonly type = UPDATE_ROOM_INFO;
  constructor(public payload: { room: Room }) { }
}

export type RoomActions = SendMessage | GetMessage | LoadMessages | BugLoadMessages | GetRooms | JoinRoom | LeaveRoom |
  KickUser | ChangeActiveRoom | SetRoomUsers | InsertUser | ResetRoomUnreadCount | SetActiveRoomUndefined | UpdateRoomInfo;
