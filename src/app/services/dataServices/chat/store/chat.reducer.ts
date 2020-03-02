import * as ChatActions from './chat.actions';
import { Room } from 'src/app/dtos/room';
import { MMessage } from 'src/app/dtos/Message';

export interface State {
  rooms: Room[];
  activeRoom: Room;
}

const initialState: State = {
  rooms: undefined,
  activeRoom: undefined
}

export function chatReducer(state = initialState, action: ChatActions.ChatActions) {
  let room: Room;
  switch (action.type) {
    case ChatActions.GET_MESSAGE:
      return {
        ...state,
        rooms: [action.payload.room],
      }
    case ChatActions.SEND_MESSAGE:
      room = state.rooms.find(p => p._id === action.payload.room._id);
      return {
        ...state,
        room: [...state.rooms, {...room, messages: [...room.messages, ...action.payload.message]}]
      }
    case ChatActions.JOIN_ROOM:
      return {
        ...state,
        room: [...state.rooms, action.payload.room]
      }
    case ChatActions.QUIT_ROOM:
      return {
        ...state,
        room: state.rooms.filter(p => p._id !== action.payload.room._id)
      }
    case ChatActions.KICK_USER:
      room = state.rooms.find(p => p._id === action.payload.room._id);
      return {
        ...state,
        room: [...state.rooms, {...room, users: room.users.filter( p => p._id !== action.payload.user._id )}]
      }
    default:
      return state;
  }
}
