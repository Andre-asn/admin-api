import type React from "react";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  success?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type, error, success, ...props }, ref) => {
    let borderColor = "border-gray-300 focus:border-[#3F3FC2]";
    let bgColor = "bg-white";

    if (error) {
      borderColor = "border-red-500 focus:border-red-500";
      bgColor = "bg-red-50";
    } else if (success) {
      borderColor = "border-teal-500 focus:border-teal-600";
      bgColor = "bg-teal-50";
    }

    return (
      <div className="w-full">
        <input
          type={type}
          ref={ref}
          className={`
            flex h-12 w-full rounded-lg border-2 px-3 py-3 text-sm text-gray-900
            placeholder:text-gray-400 
            focus:outline-none focus:ring-0
            disabled:cursor-not-allowed disabled:opacity-50
            transition-colors duration-200
            ${borderColor}
            ${bgColor}
            ${className}
          `}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
