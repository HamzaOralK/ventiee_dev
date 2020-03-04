import { Action } from '@ngrx/store';
import { MMessage } from '../../../../dtos/message';
import { Room } from '../../../../dtos/room';
import { User } from 'src/app/dtos/user';

export const SEND_MESSAGE = 'SEND_MESSAGE';
export const GET_MESSAGE = 'GET_MESSAGE';
export const JOIN_ROOM = 'JOIN_ROOM';
export const QUIT_ROOM = 'QUIT_ROOM';
export const KICK_USER = 'KICK_USER';
export const CHANGE_ACTIVE_ROOM = 'CHANGE_ACTIVE_ROOM';


export class SendMessage implements Action {
  readonly type = SEND_MESSAGE;
  constructor(public payload: { room: Room, message?: MMessage[] }) { }
}

export class GetMessage implements Action {
  readonly type = GET_MESSAGE;
  constructor(public payload: { room: Room, messages?: MMessage }) { }
}

export class JoinRoom implements Action {
  readonly type = JOIN_ROOM;
  constructor(public payload: { room: Room }) { }
}

export class QuitRoom implements Action {
  readonly type = QUIT_ROOM;
  constructor(public payload: { room: Room }) { }
}

export class KickUser implements Action {
  readonly type = KICK_USER;
  constructor(public payload: { room: Room, user?: User }) { }
}

export class ChangeActiveRoom implements Action {
  readonly type = CHANGE_ACTIVE_ROOM;
  constructor(public payload: { room: Room }) { }
}

export type RoomActions = SendMessage | GetMessage | JoinRoom | QuitRoom | KickUser | ChangeActiveRoom;
