enum UserType {
    Basic,
    Premium,
    Admin
}

export class User {
    email: string;
    name: string;
    surname: string;
    description:string;
    birthday: Date;
    id: string;
    userType: UserType;
}
