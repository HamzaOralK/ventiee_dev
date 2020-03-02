import * as RoomActions from './room.actions';
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

export function roomReducer(state = initialState, action: RoomActions.RoomActions) {
  let room: Room;
  switch (action.type) {
    case RoomActions.GET_MESSAGE:
      return {
        ...state,
        rooms: [action.payload.room],
      }
    case RoomActions.SEND_MESSAGE:
      room = state.rooms.find(p => p._id === action.payload.room._id);
      return {
        ...state,
        room: [...state.rooms, {...room, messages: [...room.messages, ...action.payload.message]}]
      }
    case RoomActions.JOIN_ROOM:
      return {
        ...state,
        room: [...state.rooms, action.payload.room]
      }
    case RoomActions.QUIT_ROOM:
      return {
        ...state,
        room: state.rooms.filter(p => p._id !== action.payload.room._id)
      }
    case RoomActions.KICK_USER:
      room = state.rooms.find(p => p._id === action.payload.room._id);
      return {
        ...state,
        room: [...state.rooms, {...room, users: room.users.filter( p => p._id !== action.payload.user._id )}]
      }
    default:
      return state;
  }
}
