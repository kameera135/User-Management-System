export class User {
    id: any;
    username: string;
    fName: string;
    lName: string;
    token: string;
    permissions: string[];
    platforms: string[];
    profileImage: string;
    email: string;
    UserDetails:string[]

    role: string;

    constructor(data: any) {
        this.id = data.userId || data.id;
        this.username = data.userName || data.username;
        this.fName = data.firstName || data.fName;
        this.lName = data.lastName || data.lName;
        this.email = data.email;
        this.platforms = data.platforms;
        this.profileImage = data.profileImage;
        this.token = data.token;
        this.permissions = data.permissions;
        this.UserDetails = data.UserDetails?data.UserDetails:[];

        this.role = data.role;
    }

    get fullName(): string {
        return `${this.fName} ${this.lName}`;
    }

}