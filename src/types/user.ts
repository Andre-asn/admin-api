export interface User {
    id: string;  // UUID
    role_id: number;
    email: string;
    firstName: string;
    lastName: string;
    gender?: string;
    dateOfBirth?: Date;
    createdAt: Date;
    updatedAt: Date;
} 