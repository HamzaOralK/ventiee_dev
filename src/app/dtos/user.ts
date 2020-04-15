import { UserType, Gender, SchoolType, RelationshipStatus } from './enums';
import { UserSettings } from './userSettings';
import { Event } from './event';

export class User {
  email: string;
  nickname: string;
  name: string;
  surname: string;
  description:string;
  schoolType: SchoolType;
  school: string;
  birthday: Date;
  language: string;
  /* Userla id dönülecek */
  _id: string;
  userType: UserType;
  userSetting: UserSettings;
  gender: Gender;
  relationshipStatus: RelationshipStatus;
  password:string;
  emailNotification: boolean;
}

export class UserComment {
  event: Event;
  user: User;
  comment: string;
  rating: number;
}

