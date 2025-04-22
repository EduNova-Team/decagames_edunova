import React from "react";

type IconSize = "sm" | "md" | "lg" | "xl";
type IconVariant = "primary" | "secondary" | "outline" | "ghost";

interface IconProps {
  name: string;
  size?: IconSize;
  variant?: IconVariant;
  className?: string;
}

const icons = {
  upload: (
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
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
  ),
  list: (
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
    >
      <path d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
    </svg>
  ),
  play: (
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
    >
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  ),
  check: (
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
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  home: (
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
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  ),
  arrowRight: (
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
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  ),
};

const Icon: React.FC<IconProps> = ({
  name,
  size = "md",
  variant = "primary",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const variantClasses = {
    primary: "text-[var(--accent)]",
    secondary: "text-[var(--secondary)]",
    outline: "text-[var(--foreground)] opacity-80",
    ghost: "text-[var(--foreground)] opacity-60",
  };

  const classes = `inline-block ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (!icons[name as keyof typeof icons]) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <span className={classes}>{icons[name as keyof typeof icons]}</span>;
};

export default Icon;

export const IconBox: React.FC<{
  children: React.ReactNode;
  color?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}> = ({ children, color = "primary", size = "md", className = "" }) => {
  const colorClasses = {
    primary: "bg-[var(--accent)]",
    secondary: "bg-[var(--secondary)]",
  };

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div
      className={`rounded-full ${colorClasses[color]} ${sizeClasses[size]} flex items-center justify-center text-white ${className}`}
    >
      {children}
    </div>
  );
};
