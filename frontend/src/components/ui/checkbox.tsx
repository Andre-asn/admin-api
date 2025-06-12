"use client";
import { useState } from "react";

interface CheckboxProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
  label?: string;
}

const Checkbox = ({
  id,
  className = "",
  checked: controlledChecked,
  onCheckedChange,
  disabled = false,
  label,
  ...props
}: CheckboxProps) => {
  const [internalChecked, setInternalChecked] = useState(false);

  const isChecked =
    controlledChecked !== undefined ? controlledChecked : internalChecked;

  const handleClick = () => {
    if (disabled) return;

    const newValue = !isChecked;

    if (controlledChecked === undefined) {
      setInternalChecked(newValue);
    }

    if (onCheckedChange) {
      onCheckedChange(newValue);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div
        role="checkbox"
        aria-checked={isChecked}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        className={`
          relative w-5 h-5 border-2 rounded-sm flex items-center justify-center transition-colors duration-200 ease-in-out
          ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
          ${
            isChecked
              ? "bg-[#3F3FC2] border-[#3F3FC2]"
              : "bg-white border-gray-300 hover:border-[#3F3FC2]"
          }
          focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
          ${className}
        `}
        {...props}
      >
        {isChecked && (
          <svg
            className="h-3 w-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      {label && (
        <label
          htmlFor={id}
          className="text-sm text-gray-700 cursor-pointer select-none"
          onClick={handleClick}
        >
          {label}
        </label>
      )}
      {id && (
        <input
          type="checkbox"
          id={id}
          className="sr-only"
          checked={isChecked}
          readOnly
        />
      )}
    </div>
  );
};

export default Checkbox;
