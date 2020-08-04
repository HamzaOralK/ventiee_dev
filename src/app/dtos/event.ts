import { User } from './user';

export class Event {
  _id: string;
  title: string;
  status: EventStatus;
  currentPeopleCount: number;
  peopleCount: number;
  startDate: Date;
  endDate: Date;
  venue: string;
  district: string;
  city: string;
  longtitute: string;
  latitute: string;
  moderatorUser: User;
  moderatorUserId: string;
  description: string;
  tags: string[];
  type: EventType;
  imageURI?: string;
  base64: any;
  comments: EventComment[];
  isCommented: boolean;
}

export enum EventStatus {
  Pending = 0,
  Active = 1,
  Completed = 2,
  Cancelled = 9,
  Deleted = -1
}

export class MLocation {
  district: string;
  city: string;
  long: string;
  lat: string;
}

export enum EventType {
  meeting = 'meeting',
  conversation = 'conversation'
}

export class EventFilter {
  startDate: Date;
  title: string;
  district: string;
  city: string;
  tags: string[];
  status: EventStatus;
  sort: EventSort;
}

export class EventSort {
  prop: string;
  direction: number;
}

export class EventComment {
  _id: string;
  user: User;
  date: Date;
  comment: string;
  rating: number;
}
