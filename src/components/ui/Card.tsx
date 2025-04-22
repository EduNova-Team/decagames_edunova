import React from "react";
import Link from "next/link";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  animate?: boolean;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  href,
  animate = false,
  hover = false,
}) => {
  const baseClasses =
    "p-6 border border-[var(--card-border)] rounded-xl bg-[var(--card-bg)] shadow-md";
  const animateClass = animate ? "animate-scale-in" : "";
  const hoverClass = hover ? "card-hover" : "";

  const classes = `${baseClasses} ${animateClass} ${hoverClass} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
};

export default Card;

export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>;
};

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return <div className={className}>{children}</div>;
};

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div
      className={`mt-4 pt-4 border-t border-[var(--card-border)] ${className}`}
    >
      {children}
    </div>
  );
};
