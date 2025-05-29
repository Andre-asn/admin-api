import { Doctor } from '../types/doctor';

export const mockDoctors: Doctor[] = [
  {
    id: "1",
    userId: "user-1",
    specialization: "Cardiology",
    licenseNumber: "MD12345",
    yearsOfExperience: 8,
    institution: "Johns Hopkins University",
    degree: "Doctor of Medicine (MD)",
    yearsOfEducation: 8,
    status: "approved",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    // User info (would come from JOIN with users table)
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@junohealthcare.com"
  },
  {
    id: "2",
    userId: "user-2",
    specialization: "Pediatrics",
    licenseNumber: "MD67890",
    yearsOfExperience: 5,
    institution: "Harvard Medical School",
    degree: "Doctor of Medicine (MD)",
    yearsOfEducation: 8,
    status: "pending",
    createdAt: "2024-01-16T14:30:00Z",
    updatedAt: "2024-01-16T14:30:00Z",
    // User info (would come from JOIN with users table)
    firstName: "Michael",
    lastName: "Chen",
    email: "mike.chen@junohealthcare.com"
  },
  {
    id: "3",
    userId: "user-3",
    specialization: "Dermatology",
    licenseNumber: "MD11111",
    yearsOfExperience: 12,
    institution: "Stanford University School of Medicine",
    degree: "Doctor of Medicine (MD)",
    yearsOfEducation: 8,
    status: "approved",
    createdAt: "2024-01-17T09:15:00Z",
    updatedAt: "2024-01-17T09:15:00Z",
    // User info (would come from JOIN with users table)
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "emily.rodriguez@junohealthcare.com"
  }
];