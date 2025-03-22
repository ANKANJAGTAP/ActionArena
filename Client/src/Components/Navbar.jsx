import React, { useState } from "react";
import { User, Move, Volleyball, GraduationCap, LogOut, Menu, X } from "lucide-react";
import logo from "../assets/logo.jpg";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isAuthenticated = token !== null;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Common navigation links component
  const navLinks = (
    <div className="flex space-x-12 text-gray-700 text-2xl font-semibold">
      <NavLink
        to="/play"
        className={({ isActive }) =>
          `flex items-center space-x-2 transition duration-300 ease-in-out ${
            isActive
              ? "text-green-600 border-b-4 border-green-500"
              : "text-gray-700 hover:text-green-600"
          }`
        }
      >
        <Move size={20} />
        <span>Play</span>
      </NavLink>
      <NavLink
        to="/book"
        className={({ isActive }) =>
          `flex items-center space-x-2 transition duration-300 ease-in-out ${
            isActive
              ? "text-green-600 border-b-4 border-green-500"
              : "text-gray-700 hover:text-green-600"
          }`
        }
      >
        <Volleyball size={20} />
        <span>Book</span>
      </NavLink>
      <NavLink
        to="/train"
        className={({ isActive }) =>
          `flex items-center space-x-2 transition duration-300 ease-in-out ${
            isActive
              ? "text-green-600 border-b-4 border-green-500"
              : "text-gray-700 hover:text-green-600"
          }`
        }
      >
        <GraduationCap size={20} />
        <span>Train</span>
      </NavLink>
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Left: Logo */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
          <NavLink to="/" className="text-green-600 text-3xl font-bold ml-2">
            ArenaX<span className="ml-1 text-sm">&#174;</span>
          </NavLink>
        </div>

        {/* Center: Navigation Links (Desktop Only) */}
        <div className="hidden md:flex flex-grow justify-center">
          {isAuthenticated && navLinks}
        </div>

        {/* Right: Profile or Login/Signup (Desktop Only) */}
        <div className="hidden md:flex items-center">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-green-600 text-2xl focus:outline-none"
              >
                <User size={20} />
                <NavLink to="/profile">Profile</NavLink>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 border border-gray-200">
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/signup"
              className="flex items-center space-x-2 text-gray-700 hover:text-green-600 text-2xl"
            >
              <User size={20} />
              <span>Login / Signup</span>
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 hover:text-green-600 focus:outline-none"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md border-t border-gray-200">
          <div className="px-4 py-2">
            {isAuthenticated ? (
              <>
                <div className="flex flex-col space-y-4">
                  {navLinks}
                  <NavLink
                    to="/profile"
                    className="block text-gray-700 hover:text-green-600 text-xl"
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-gray-700 hover:text-green-600 text-xl flex items-center space-x-2"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <NavLink
                to="/signup"
                className="block text-gray-700 hover:text-green-600 text-xl"
              >
                Login / Signup
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
