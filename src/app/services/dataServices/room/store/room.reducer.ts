import * as RoomActions from './room.actions';
import { Room } from 'src/app/dtos/room';

export interface State {
  rooms: Room[];
  activeRoom: Room;
  unreadMessages: number;
}

const initialState: State = {
  rooms: [],
  activeRoom: undefined,
  unreadMessages: 0
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
      if(!room.messages) room.messages = [];
      let dumMessages = [...room.messages, ...action.payload.message];
      room.messages = dumMessages;
      state.rooms[roomIndex] = room;
      let unreadMessages = state.unreadMessages;
      if(action.payload.message[0].user._id !== action.payload.user._id) {
        unreadMessages++;
      }
      return {
        ...state,
        rooms: [...state.rooms],
        unreadMessages:  unreadMessages
      }
    case RoomActions.LOAD_MESSAGES:
      roomIndex = state.rooms.findIndex(p => p._id === action.payload.room._id);
      state.rooms[roomIndex].messages = action.payload.messages;
      return {
        ...state,
        rooms: [...state.rooms]
      }
    case RoomActions.GET_ROOMS:
      return {
        ...state,
        rooms: [...state.rooms, ...action.payload.rooms]
      }
    case RoomActions.JOIN_ROOM:
      return {
        ...state,
        activeRoom: action.payload.room,
        rooms: [...state.rooms, action.payload.room]
      }
    case RoomActions.QUIT_ROOM:
      return {
        ...state,
        rooms: state.rooms.filter(p => p._id !== action.payload.room._id)
      }
    case RoomActions.KICK_USER:
      roomIndex = state.rooms.findIndex(p => p._id === action.payload.room._id);
      state.rooms[roomIndex].users = state.rooms[roomIndex].users.filter(u => u._id !== action.payload.userId);
      return {
        ...state,
        rooms: [...state.rooms]
      }
    case RoomActions.CHANGE_ACTIVE_ROOM:
      //room = state.rooms.find(p => p._id === action.payload.roomId);
      roomIndex = state.rooms.findIndex(p => p._id === action.payload.roomId);
      return {
        ...state,
        activeRoom: state.rooms[roomIndex]
      }
    case RoomActions.SET_ROOM_USERS:
      roomIndex = state.rooms.findIndex(p => p._id === action.payload.room._id);
      state.rooms[roomIndex].users = action.payload.users;
      return {
        ...state,
        rooms: state.rooms,
        activeRoom: state.rooms[roomIndex]
      }
    default:
      return state;
  }
}
