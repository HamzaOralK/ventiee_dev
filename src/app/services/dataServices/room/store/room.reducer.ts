import * as RoomActions from './room.actions';
import { Room } from 'src/app/dtos/room';
import { RoomType } from 'src/app/dtos/enums';

export interface State {
  rooms: Room[];
  activeRoom: Room;
}

const initialState: State = {
  rooms: [{_id: "10", eventId: "10", roomType: RoomType.Public, messages:[], users:[]},
          {_id: "20", eventId: "10", roomType: RoomType.Public, messages: [], users: []}],
  activeRoom: undefined
}

export function roomReducer(state = initialState, action: RoomActions.RoomActions) {
  let room: Room;
  let roomIndex: number;
  switch (action.type) {
    case RoomActions.GET_MESSAGE:
      return {
        ...state,
        activeRoom: action.payload.room
      }
    case RoomActions.SEND_MESSAGE:
      roomIndex = state.rooms.findIndex(p => p._id === action.payload.room._id);
      room = state.rooms[roomIndex];
      let dumMessages = [...room.messages, ...action.payload.message];
      room.messages = dumMessages;
      state.rooms[roomIndex] = room;
      console.log({ 
        ...state,
        rooms: [...state.rooms]
      });
      return {
        ...state,
        rooms: [...state.rooms]
      }
    case RoomActions.JOIN_ROOM:
      return {
        ...state,
        rooms: [...state.rooms, action.payload.room]
      }
    case RoomActions.QUIT_ROOM:
      return {
        ...state,
        rooms: state.rooms.filter(p => p._id !== action.payload.room._id)
      }
    case RoomActions.KICK_USER:
      room = state.rooms.find(p => p._id === action.payload.room._id);
      return {
        ...state,
        rooms: [...state.rooms, {...room, users: room.users.filter( p => p._id !== action.payload.user._id )}]
      }
    case RoomActions.CHANGE_ACTIVE_ROOM:
      room = state.rooms.find(p => p._id === action.payload.roomId);
      return {
        ...state,
        activeRoom: room
      }
    default:
      return state;
  }
}
