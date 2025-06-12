"use client";
import { useState, forwardRef } from "react";
import type React from "react";

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: string;
  showStrength?: boolean;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    { className = "", error, showStrength = false, value, onChange, ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const getPasswordStrength = (password: string) => {
      if (!password) return { strength: "", color: "" };

      let score = 0;
      if (password.length >= 6) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/[a-z]/.test(password)) score++;
      if (/\d/.test(password)) score++;
      if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

      if (score < 2) return { strength: "Weak", color: "text-red-500" };
      if (score < 4) return { strength: "Fair", color: "text-yellow-500" };
      if (score < 5) return { strength: "Good", color: "text-blue-500" };
      return { strength: "Strong", color: "text-green-500" };
    };

    const passwordStrength =
      showStrength && value ? getPasswordStrength(value as string) : null;

    return (
      <div className="w-full">
        <div className="relative">
          {/* Lock Icon */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          {/* Input Field */}
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={onChange}
            className={`
              flex h-12 w-full rounded-lg border-2 pl-10 pr-12 py-3 text-sm text-gray-900
              placeholder:text-gray-400
              focus:outline-none
              focus:ring-0
              transition-colors duration-200
              ${
                error
                  ? "border-red-500 focus:border-red-500 bg-red-50"
                  : passwordStrength?.strength === "Strong"
                  ? "border-teal-500 focus:border-teal-500"
                  : "border-gray-300 focus:border-[#3F3FC2]"
              }
              disabled:cursor-not-allowed disabled:opacity-50
              ${className}
            `}
            {...props}
          />

          {/* Eye Icon */}
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5
                    c4.478 0 8.268 2.943 9.542 7
                    -1.274 4.057-5.064 7-9.542 7
                    -4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-eye-off h-5 w-5"
              >
                <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"></path>
                <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"></path>
                <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"></path>
                <path d="m2 2 20 20"></path>
              </svg>
            )}
          </button>
        </div>

        {showStrength && passwordStrength && (
          <div className="mt-1 text-xs">
            <span className={passwordStrength.color}>
              Password strength: {passwordStrength.strength}
            </span>
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
