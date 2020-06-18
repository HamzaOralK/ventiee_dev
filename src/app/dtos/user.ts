import { UserType, Gender, SchoolType, RelationshipStatus } from './enums';

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
  imageURI?: string;
}
