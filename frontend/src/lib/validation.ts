// Zod validation utility
import { z } from "zod";

// Login form validation schema
export const loginValidationSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be no more than 255 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be no more than 128 characters")
    .refine((password) => /[A-Z]/.test(password), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((password) => /[a-z]/.test(password), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((password) => /\d/.test(password), {
      message: "Password must contain at least one number",
    })
    .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
      message: "Password must contain at least one special character",
    }),
});

// Registration form validation schema
export const registrationValidationSchema = z
  .object({
    firstName: z.string().min(1, "Enter your First Name."),
    lastName: z.string().min(1, "Enter your Last Name."),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .max(255, "Email must be no more than 255 characters"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(128, "Password must be no more than 128 characters")
      .refine((password) => /[A-Z]/.test(password), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((password) => /[a-z]/.test(password), {
        message: "Password must contain at least one lowercase letter",
      })
      .refine((password) => /\d/.test(password), {
        message: "Password must contain at least one number",
      })
      .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginValidationSchema>;
export type RegistrationFormData = z.infer<typeof registrationValidationSchema>;

// Utility functions for real-time validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string
): { isValid: boolean; strength: string; errors: string[] } => {
  const errors: string[] = [];
  let strength = "weak";

  if (password.length < 6) {
    errors.push("At least 6 characters");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("One uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("One lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("One number");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("One special character");
  }

  // Determine strength
  if (errors.length === 0) {
    if (password.length >= 12) {
      strength = "strong";
    } else if (password.length >= 8) {
      strength = "medium";
    } else {
      strength = "fair";
    }
  }

  return {
    isValid: errors.length === 0,
    strength,
    errors,
  };
};

// Validation helper function
export const validateForm = (schema: any, data: any) => {
  try {
    schema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      return { success: false, errors: fieldErrors };
    }
    return { success: false, errors: { general: "Validation failed" } };
  }
};
