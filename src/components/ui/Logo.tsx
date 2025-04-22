import React from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  withText?: boolean;
  className?: string;
  darkMode?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  size = "md",
  withText = true,
  className = "",
  darkMode = true,
}) => {
  const sizeMap = {
    sm: 24,
    md: 32,
    lg: 48,
  };

  const textClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const logoSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="relative flex-shrink-0"
        style={{ width: logoSize, height: logoSize }}
      >
        <Image
          src="/logo.png"
          alt="DECAGames Logo"
          width={logoSize}
          height={logoSize}
          priority
          className="object-contain"
        />
      </div>

      {withText && (
        <div className={`font-semibold tracking-tight ${textClasses[size]}`}>
          <span className="text-[#3B82F6] uppercase mr-0.5 tracking-[-0.25px]">
            DECA
          </span>
          <span className={darkMode ? "text-white" : "text-[#10B981]"}>
            Games
          </span>
        </div>
      )}
    </div>
  );
};

export default function LogoLink({
  size,
  withText,
  className = "",
  darkMode = true,
}: LogoProps) {
  return (
    <Link href="/" className={`group ${className}`}>
      <Logo
        size={size}
        withText={withText}
        darkMode={darkMode}
        className="group-hover:opacity-90 transition-opacity"
      />
    </Link>
  );
}
