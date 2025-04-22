import React from "react";
import Button from "@/components/ui/Button";
import LogoLink from "@/components/ui/Logo";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-[#0F1117] border-b border-gray-800 sticky top-0 z-50 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <LogoLink size="md" darkMode={true} />

        {title && (
          <h1 className="text-lg md:text-xl font-medium hidden md:block animate-fade-in text-white">
            {title}
          </h1>
        )}

        <nav className="flex items-center space-x-3">
          <Button
            href="/games"
            variant="ghost"
            size="sm"
            className="font-medium text-gray-200 hover:text-white"
          >
            My Games
          </Button>
          <Button
            href="/upload"
            variant="primary"
            size="sm"
            className="font-medium"
          >
            Upload PDF
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
