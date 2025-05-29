export interface Doctor {
    id: string;
    userId?: string;               // Camel case version
    specialization: string;
    licenseNumber: string;
    yearsOfExperience: number;     // More readable name
    institution: string;
    degree: string;
    yearsOfEducation: number;      // More readable name
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;             // String for JSON
    updatedAt: string;             // String for JSON
    // Note: We'll get firstName, lastName, email from the users table via JOIN
    firstName?: string;            // From users table
    lastName?: string;             // From users table
    email?: string;                // From users table
  }