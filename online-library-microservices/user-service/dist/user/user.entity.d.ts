export declare enum UserRole {
    USER = "user",
    ADMIN = "admin"
}
export declare class User {
    id: string;
    username: string;
    password: string;
    role: UserRole;
    generateUUID(): void;
}
