"use client";

import type React from "react";
import { useState } from "react";
import Button from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import Input from "@/src/components/ui/input";
import Label from "@/src/components/ui/label";
import { Stethoscope, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { forgotPassword } from "@/src/services/auth-service";
import { validateEmail } from "@/src/lib/validation";
import Image from "next/image";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validate email
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Sending forgot password request for:", email);

      const response = await forgotPassword({ email });

      console.log("Forgot password response:", response);

      setMessage(response.message);
      setIsSuccess(true);
      setEmail(""); // Clear the form
    } catch (err) {
      console.error("Forgot password failed:", err);

      let errorMessage = "Failed to send reset link. Please try again.";

      if (err instanceof Error) {
        if (
          err.message.includes("User not found") ||
          err.message.includes("404")
        ) {
          errorMessage = "No account found with this email address.";
        } else if (
          err.message.includes("server") ||
          err.message.includes("500")
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

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardHeader className="text-center">
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
          <CardTitle className="text-2xl font-bold text-gray-900">
            Reset Password
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm font-medium">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm font-medium flex items-center">
              <Check className="w-4 h-4 mr-2" />
              {message}
            </div>
          )}

          {!isSuccess && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending Reset Link...
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          )}

          <div className="text-center">
            <Link
              href="/"
              className={`inline-flex items-center text-sm text-[#3F3FC2] ${
                isLoading ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default ForgotPassword;
