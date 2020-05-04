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
  gender: Gender;
  relationshipStatus: RelationshipStatus;
  password:string;
  emailNotification: boolean;
  preferredGender: Gender;
  color: Color;
}

export class Color {
  constructor(public r: number, public g: number, public b: number, public a: number) {}

}

export class UserComment {
  event: Event;
  user: User;
  comment: string;
  rating: number;
}

