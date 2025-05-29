export type UserRole = 'admin' | 'doctor' | 'patient';

export interface User {
    id: string;  // UUID
    role: UserRole;
    email: string;
    firstName: string;
    lastName: string;
    gender?: string;
    dateOfBirth?: Date;
    createdAt: Date;
    updatedAt: Date;
} 