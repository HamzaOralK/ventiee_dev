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
      if(roomIndex > -1) {
        room = state.rooms[roomIndex];
        if(!room.messages) room.messages = [];
        let dumMessages = [...room.messages, ...action.payload.message];
        room.messages = dumMessages;
        state.rooms[roomIndex] = room;
        let unreadMessages = state.unreadMessages;
        if(action.payload.message[0].roomUser.user._id !== action.payload.roomUser.user._id) {
          unreadMessages++;
        }
        return {
          ...state,
          rooms: [...state.rooms],
          unreadMessages: unreadMessages
        }
      }
      break;
    case RoomActions.LOAD_MESSAGES:
      roomIndex = state.rooms.findIndex(p => p._id === action.payload.room._id);
      if (state.rooms[roomIndex].messages)
        state.rooms[roomIndex].messages = [...action.payload.messages, ...state.rooms[roomIndex].messages];
      else {
        state.rooms[roomIndex].messages = action.payload.messages;
      }
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
    case RoomActions.INSERT_USER:
      room = state.rooms.find(p => p._id === action.payload.roomId);
      if(room.users && room.users.findIndex(u => u.user._id === action.payload.roomUser.user._id) === -1) room.users.push(action.payload.roomUser);
      return {
        ...state
      }
    case RoomActions.LEAVE_ROOM:
      return {
        ...state,
        rooms: state.rooms.filter(p => p._id !== action.payload.room._id)
      }
    case RoomActions.KICK_USER:
      roomIndex = state.rooms.findIndex(p => p._id === action.payload.room._id);
      if (roomIndex > -1 && state.rooms[roomIndex].users) {
        state.rooms[roomIndex].users = state.rooms[roomIndex].users.filter(u => u.user._id !== action.payload.roomUserId);
      }
      return {
        ...state,
        rooms: [...state.rooms]
      }
    case RoomActions.CHANGE_ACTIVE_ROOM:
      //room = state.rooms.find(p => p._id === action.payload.roomId);
      room = undefined;
      roomIndex = state.rooms.findIndex(p => p._id === action.payload.roomId);
      if(roomIndex > -1) room = state.rooms[roomIndex];
      return {
        ...state,
        activeRoom: room
      }
    case RoomActions.SET_ROOM_USERS:
      roomIndex = state.rooms.findIndex(p => p._id === action.payload.room._id);
      state.rooms[roomIndex].users = action.payload.roomUsers;
      return {
        ...state,
        rooms: state.rooms,
        activeRoom: state.rooms[roomIndex]
      }
    default:
      return state;
  }
}
