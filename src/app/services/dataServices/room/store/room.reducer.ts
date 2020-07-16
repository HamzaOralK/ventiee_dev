import * as RoomActions from './room.actions';
import { Room } from 'src/app/dtos/room';
import cloneDeep from "lodash.clonedeep";
import { COMMONS } from 'src/app/shared/commons';


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
  let copyState: any;
  switch (action.type) {
    case RoomActions.GET_MESSAGE:
      return {
        ...state,
        activeRoom: action.payload.room
      }
    case RoomActions.SEND_MESSAGE:
      roomIndex = state.rooms.findIndex(p => p._id === action.payload.room._id);
      copyState = cloneDeep(state);
      if(roomIndex > -1) {
        room = copyState.rooms[roomIndex];
        if(room.messages) {
          let dumMessages = [...room.messages, ...action.payload.message];
          room.messages = dumMessages;
          let unreadMessages = room.unreadMessagesCount;
          if (unreadMessages === undefined) unreadMessages = 0;
          if (
            (!copyState.activeRoom || copyState.activeRoom._id !== action.payload.room._id) &&
            action.payload.message[0].roomUser.user._id !== action.payload.roomUser.user._id
          ) {
            unreadMessages++;
          }
          room.unreadMessagesCount = unreadMessages;

        }
        copyState.rooms[roomIndex] = room;
        return {
          ...copyState,
          rooms: [...copyState.rooms],
        };
      }
      break;
    case RoomActions.LOAD_MESSAGES:
      roomIndex = state.rooms.findIndex(p => p._id === action.payload.room._id);
      copyState = cloneDeep(state);
      if (copyState.rooms[roomIndex].messages)
        copyState.rooms[roomIndex].messages = [...action.payload.messages, ...state.rooms[roomIndex].messages];
      else {
        copyState.rooms[roomIndex].messages = action.payload.messages;
      }
      return {
        ...copyState,
        // rooms: [...copyState.rooms],
      };
    case RoomActions.BUG_LOAD_MESSAGES:
      roomIndex = state.rooms.findIndex(p => p._id === action.payload.room._id);
      copyState = cloneDeep(state);
      copyState.rooms[roomIndex].messages = action.payload.messages;

      return {
        ...copyState,
        // rooms: [...copyState.rooms],
      };
    case RoomActions.GET_ROOMS:
      if (action.payload.rooms.length > 0) {
        return {
          ...state,
          rooms: [...state.rooms, ...action.payload.rooms]
        }
      }
      break;
    case RoomActions.JOIN_ROOM:
      return {
        ...state,
        activeRoom: action.payload.room,
        rooms: [...state.rooms, action.payload.room]
      }
    case RoomActions.INSERT_USER:
      copyState = cloneDeep(state);
      room = copyState.rooms.find((p) => p._id === action.payload.roomId);
      if(room.users && room.users.findIndex(u => u.user._id === action.payload.roomUser.user._id) === -1) room.users.push(action.payload.roomUser);
      return {
        ...copyState
      };
    case RoomActions.LEAVE_ROOM:
      return {
        ...state,
        rooms: state.rooms.filter(p => p._id !== action.payload.room._id),
        activeRoom: undefined
      }
    case RoomActions.KICK_USER:
      roomIndex = state.rooms.findIndex(p => p._id === action.payload.room._id);
      copyState = cloneDeep(state);
      if (roomIndex > -1 && copyState.rooms[roomIndex].users) {
        copyState.rooms[roomIndex].users = copyState.rooms[roomIndex].users.filter(u => u.user._id !== action.payload.roomUserId);
      }
      return {
        ...copyState,
        rooms: [...copyState.rooms],
      };
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
      copyState = cloneDeep(state);
      copyState.rooms[roomIndex].users = cloneDeep(action.payload.roomUsers);
      copyState.rooms[roomIndex].users.map((ru) => {
        if (!ru.color) {
          ru.color = COMMONS.generateRandomRGBAColor();
        }
        return ru.user;
      });
      return {
        ...copyState,
        rooms: copyState.rooms,
        activeRoom: copyState.rooms[roomIndex],
      };
    case RoomActions.RESET_ROOM_UNREAD_COUNT:
      roomIndex = state.rooms.findIndex(p => p._id === action.payload.room._id);
      copyState = cloneDeep(state);
      copyState.rooms[roomIndex].unreadMessagesCount = 0;
      return {
        ...state,
        rooms: copyState.rooms,
        activeRoom: copyState.rooms[roomIndex],
      };
    case RoomActions.SET_ACTIVE_ROOM_UNDEFINED:
      return {
        ...state,
        activeRoom: undefined
      }
    default:
      return state;
  }
}
