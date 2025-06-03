import { User } from './user';

export type DoctorStatus = 'pending' | 'approved' | 'rejected';

export interface Doctor {
    id: string;  // UUID
    userId?: string;  // UUID
    specialization: string;
    licenseNumber: string;
    yearsOfExperience: number;
    institution: string;
    degree: string;
    yearsOfEducation: number;
    status: DoctorStatus;
    createdAt: Date;
    updatedAt: Date;

    // Joined fields
    firstName?: string;
    lastName?: string;
    email?: string;
    address?: DoctorAddress;
    approval?: Approval;
}

export interface DoctorAddress {
    doctorId: string;  // UUID
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Approval {
    doctorId: string;  // UUID
    status: DoctorStatus;
    reviewedBy?: string;  // UUID
    reviewedAt?: Date;
    comments?: string;
    createdAt: Date;
    updatedAt: Date;

    // Joined fields
    reviewerName?: string;
    doctorName?: string;
  }