"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Check, Mail } from "lucide-react";
import Link from "next/link";
import {
  loginValidationSchema,
  validateEmail,
  validateForm,
} from "@/src/lib/validation";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import Label from "@/src/components/ui/label";
import Input from "@/src/components/ui/input";
import PasswordInput from "@/src/components/ui/password-input";
import Checkbox from "@/src/components/ui/checkbox";
import Button from "@/src/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Login } from "@/src/services/auth-service";

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Real-time email validation
  useEffect(() => {
    if (formData.email && touched.email) {
      setIsEmailValid(validateEmail(formData.email));

      // Validate email with Zod
      try {
        loginValidationSchema.shape.email.parse(formData.email);
        setErrors((prev) => ({ ...prev, email: undefined }));
      } catch (error: any) {
        if (error.errors?.[0]?.message) {
          setErrors((prev) => ({ ...prev, email: error.errors[0].message }));
        }
      }
    }
  }, [formData.email, touched.email]);

  // Real-time password validation
  useEffect(() => {
    if (formData.password && touched.password) {
      try {
        loginValidationSchema.shape.password.parse(formData.password);
        setErrors((prev) => ({ ...prev, password: undefined }));
      } catch (error: any) {
        if (error.errors?.[0]?.message) {
          setErrors((prev) => ({ ...prev, password: error.errors[0].message }));
        }
      }
    }
  }, [formData.password, touched.password]);

  const handleInputChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;

      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Mark field as touched
      setTouched((prev) => ({ ...prev, [field]: true }));

      // Clear general error when user starts typing
      if (errors.general) {
        setErrors((prev) => ({ ...prev, general: undefined }));
      }
    };

  const handleInputBlur = (field: keyof FormData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleCheckboxChange =
    (field: keyof FormData) => (checked: boolean) => {
      setFormData((prev) => ({
        ...prev,
        [field]: checked,
      }));
    };

  const validateFormData = (): boolean => {
    const validation = validateForm(loginValidationSchema, {
      email: formData.email,
      password: formData.password,
    });

    const newErrors: FormErrors = {};

    // Add validation errors
    if (!validation.success) {
      Object.assign(newErrors, validation.errors);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ general: undefined });

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
    });

    // Validate form
    if (!validateFormData()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log("Attempting login with:", {
        email: formData.email,
        rememberMe: formData.rememberMe,
      });

      const response = await Login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      console.log("Login successful:", response);

      // Clear any errors
      setErrors({});

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);

      let errorMessage = "Login failed. Please try again.";

      if (err instanceof Error) {
        // Handle specific error messages from your API
        if (
          err.message.includes("Invalid credentials") ||
          err.message.includes("401") ||
          err.message.includes("Unauthorized")
        ) {
          errorMessage =
            "Invalid email or password. Please check your credentials.";
        } else if (
          err.message.includes("User not found") ||
          err.message.includes("404")
        ) {
          errorMessage = "No account found with this email address.";
        } else if (
          err.message.includes("Account locked") ||
          err.message.includes("403")
        ) {
          errorMessage =
            "Your account has been locked. Please contact administrator.";
        } else if (
          err.message.includes("server") ||
          err.message.includes("500") ||
          err.message.includes("Internal Server Error")
        ) {
          errorMessage = "Server error. Please try again later.";
        } else if (
          err.message.includes("network") ||
          err.message.includes("fetch") ||
          err.message.includes("Unable to connect")
        ) {
          errorMessage =
            "Network error. Please check your internet connection and ensure the backend server is running.";
        } else {
          errorMessage = err.message;
        }
      }

      setErrors({
        general: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[#00044D] rounded-full flex items-center justify-center overflow-hidden">
            <Image
              src="/Juno-Logo.png"
              alt="Juno Healthcare"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Juno HealthCare</h1>
        <p className="text-sm text-gray-600 mt-1">
          Healthcare Management System
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm font-medium">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10 pointer-events-none" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                onBlur={handleInputBlur("email")}
                className="pl-10 pr-10"
                placeholder="Enter Your Email"
                error={errors.email}
                success={isEmailValid && !errors.email && touched.email}
                required
                disabled={isLoading}
              />
              {isEmailValid && !errors.email && touched.email && (
                <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-500 w-4 h-4 z-10 pointer-events-none" />
              )}
            </div>
            {errors.email && (
              <p className="text-red-600 text-xs mt-1 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <PasswordInput
              id="password"
              value={formData.password}
              onChange={handleInputChange("password")}
              onBlur={handleInputBlur("password")}
              placeholder="Enter Your Password"
              error={errors.password}
              showStrength={formData.password.length > 0}
              required
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-red-600 text-xs mt-1 font-medium">
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Checkbox
              id="remember"
              checked={formData.rememberMe}
              onCheckedChange={handleCheckboxChange("rememberMe")}
              label="Remember me"
              disabled={isLoading}
            />
            <Link
              href="/forgot-password"
              className={`text-sm text-[#3F3FC2] ${
                isLoading ? "pointer-events-none opacity-50" : ""
              }`}
            >
              Forgot your password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full py-3 rounded-md bg-[#3F3FC2] text-white text-center font-medium hover:bg-[#3535a6]"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing In...
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Don't have an account? Contact your administrator
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
