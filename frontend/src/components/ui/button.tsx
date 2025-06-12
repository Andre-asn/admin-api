import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "default",
      size = "default",
      loading = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const combineClasses = (
      ...classes: (string | undefined | null | false)[]
    ) => classes.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();

    const baseStyles = [
      "inline-flex",
      "items-center",
      "justify-center",
      "rounded-md",
      "text-sm",
      "font-medium",
      "transition-all",
      "duration-200",
      "focus:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-offset-2",
      "disabled:opacity-50",
      "disabled:pointer-events-none",
      "active:scale-95",
      "w-full", // matching screenshot's full-width
      "py-3", // matching vertical padding
    ];

    const variantStyles: Record<string, string> = {
      default:
        "bg-[#3F3FC2] text-white hover:bg-[#3535a6] focus-visible:ring-[#3F3FC2]",
      destructive:
        "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500",
      outline:
        "border border-gray-300 text-gray-900 bg-white hover:bg-gray-100 focus-visible:ring-gray-500",
      secondary:
        "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500",
      ghost:
        "bg-transparent text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-500",
      link: "bg-transparent text-blue-600 underline hover:text-blue-800 focus-visible:ring-blue-500",
    };

    const sizeStyles: Record<string, string> = {
      default: "px-4 py-2",
      sm: "h-9 px-3 text-xs",
      lg: "h-11 px-8 text-base",
      icon: "h-10 w-10 p-2",
    };

    const finalClassName = combineClasses(
      ...baseStyles,
      variantStyles[variant] || variantStyles.default,
      sizeStyles[size] || sizeStyles.default,
      loading ? "cursor-not-allowed opacity-70" : "",
      className
    );

    return (
      <button
        ref={ref}
        className={finalClassName}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
