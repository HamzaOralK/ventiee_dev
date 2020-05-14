import { User } from './user';

export class Event {
  _id: string;
  title: string;
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
}

export class MLocation {
  district: string;
  city: string;
  long: string;
  lat: string;
}
