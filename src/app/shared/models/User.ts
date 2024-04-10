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
    UserDetails:UserDetails[];
    roles: string[];

    

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

        this.roles = data.roles;
    }

    get fullName(): string {
        return `${this.fName} ${this.lName}`;
    }

}

export class UserDetails {
    PlatformID: number;
    PlatformName: string;
    PlatformURL: string;
    Role: string;
    RoleId: number;
    Permission?: string;
    Is_licence?: boolean;

    constructor(data:any){
        this.PlatformID=data.PlatformID;
        this.PlatformName=data.PlatformName;
        this.PlatformURL= data.PlatformURL;
        this.RoleId=data.RoleId;
        this.Role=data.Role;
        this.Permission=data.Permissions;
        if (data.IsLicense != null && typeof data.IsLicense == "string"){
            this.Is_licence = data.IsLicense=="Yes";
        } 
    }
}