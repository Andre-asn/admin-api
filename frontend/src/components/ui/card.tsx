import type React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = ({ className = "", ...props }: CardProps) => {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
      {...props}
    />
  );
};

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = ({ className = "", ...props }: CardHeaderProps) => {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
  );
};

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = ({ className = "", ...props }: CardTitleProps) => {
  return (
    <h3
      className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
      {...props}
    />
  );
};

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = ({ className = "", ...props }: CardContentProps) => {
  return <div className={`p-6 pt-0 ${className}`} {...props} />;
};
