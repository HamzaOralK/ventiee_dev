import { UserSettings } from './UserSettings';
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
    id: string;
    userType: UserType;
    userSetting: UserSettings;
    gender: Gender;
    relationshipStatus: RelationshipStatus
}

