import type React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = ({ className = "", ...props }: LabelProps) => {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    />
  );
};

export default Label;
