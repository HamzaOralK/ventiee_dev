import { Gender } from './enums';

export class UserSettings {
    userId: string;
    useNickname: boolean;
    theme: string;
    language: string;
    preferredGender: Gender[];
}
