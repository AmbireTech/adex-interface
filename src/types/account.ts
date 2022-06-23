export enum AccountType {
    UNSET,
    ADVERTISER,
    PUBLISHER
}

// TODO:
export enum AdExRole {
    USER,
    ADMIN,
    OWNER
}

export interface IAdExAccount {
    name: string,
    users: Array<string>,
    email: string,
    adexIdentity: string,
    role: AccountType
}