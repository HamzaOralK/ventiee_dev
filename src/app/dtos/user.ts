import { UserSettings } from './UserSettings';
import { UserType, Gender } from './enums';

export class User {
    email: string;
    nickname: string;
    name: string;
    surname: string;
    description:string;
    birthday: Date;
    id: string;
    userType: UserType;
    userSetting: UserSettings;
    gender: Gender;
}

