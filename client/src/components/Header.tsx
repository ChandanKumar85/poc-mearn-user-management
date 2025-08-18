import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow flex items-center justify-between px-4 z-10">
      {/* Left section: Logo */}
      <div className="flex items-center gap-4">
        <span className="font-bold text-lg text-indigo-700">MyApp</span>
      </div>

      {/* Right section: User Menu */}
      <div className="relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center gap-2 focus:outline-none"
        >
          <img
            src="https://via.placeholder.com/40"
            alt="User"
            className="w-10 h-10 rounded-full border"
          />
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown */}
        {userMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
            <Link
              to="/profile"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setUserMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/change-password"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setUserMenuOpen(false)}
            >
              Change Password
            </Link>
            <button
              onClick={() => {
                setUserMenuOpen(false);
                alert('Logging out...');
              }}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
