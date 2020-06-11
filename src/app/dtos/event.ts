import { User } from './user';

export class Event {
  _id: string;
  title: string;
  status: EventStatus;
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
