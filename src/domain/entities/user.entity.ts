import { VendorStatus } from "src/generated/client/enums";
import { BaseEntity } from "../base.entity";
import { Role } from "../enums/role.enum";
import { UserStatus } from "../enums/user-status.enum";
import { Vendor } from "./vendor.entity";

export class User extends BaseEntity {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    dateOfBirth?: Date;
    passwordHash: string;
    profilePhotoUrl?: string;
    role: Role;
    userStatus: UserStatus;
    vendor?: Vendor;   

    constructor(props: Partial<User>){
        super();
        this.firstName = props.firstName!;
        this.lastName = props.lastName!;
        this.email = props.email!;
        this.phoneNumber = props.phoneNumber;
        this.isEmailVerified = props.isEmailVerified ?? false;
        this.isPhoneVerified = props.isPhoneVerified ?? false;
        this.dateOfBirth = props.dateOfBirth;
        this.passwordHash = props.passwordHash!;
        this.profilePhotoUrl = props.profilePhotoUrl ?? '';
        this.role = props.role ?? Role.WORKER;
        this.userStatus = props.userStatus ?? UserStatus.ACTIVE;
        this.vendor = props.vendor;
    }
}