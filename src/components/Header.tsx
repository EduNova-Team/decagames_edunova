import React from "react";
import Link from "next/link";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-blue-600">DECAGames</span>
        </Link>

        {title && (
          <h1 className="text-lg md:text-xl font-medium hidden md:block">
            {title}
          </h1>
        )}

        <nav className="flex items-center space-x-4">
          <Link href="/games" className="text-gray-600 hover:text-gray-900">
            My Games
          </Link>
          <Link
            href="/upload"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Upload PDF
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
