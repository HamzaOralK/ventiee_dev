import { UserType, Gender, SchoolType, RelationshipStatus } from './enums';
import { UserSettings } from './userSettings';

export class User {
    email: string;
    nickname: string;
    name: string;
    surname: string;
    description:string;
    schoolType: SchoolType;
    school: string;
    birthday: Date;
    /* Userla id dönülecek */
    id: string;
    userType: UserType;
    userSetting: UserSettings;
    gender: Gender;
    relationshipStatus: RelationshipStatus;
    password:string;
}

