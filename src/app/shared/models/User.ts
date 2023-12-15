export class User {
    id: any;
    fName: string;
    lName: string;
    token: string;
    permissions: string[];
    platforms: string[];
    profileImage: string;
    email: string;

    role: string;

    constructor(data: any) {
        this.id = data.userId || data.id;
        this.fName = data.firstName || data.fName;
        this.lName = data.lastName || data.lName;
        this.email = data.email;
        this.platforms = data.platforms;
        this.profileImage = data.profileImage;
        this.token = data.token;
        this.permissions = data.permissions;

        this.role = data.role;
    }

    get fullName(): string {
        return `${this.fName} ${this.lName}`;
    }
}