// LandingModal.js
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.png"; // Update path as needed

const LandingModal = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
    >
      <div className="bg-white rounded-3xl p-10 relative max-w-4xl mx-4 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-600 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>

        {/* Two Column Layout */}
        <div className="flex flex-col sm:flex-row items-center">
          {/* Left Column: Logo */}
          <div className="flex-shrink-0 flex justify-center sm:justify-start">
            <img
              src={logo}
              alt="ArenaX Logo"
              className="w-32 sm:w-40 mb-6 sm:mb-0"
            />
          </div>

          {/* Right Column: Content */}
          <div className="sm:ml-10 text-center sm:text-left">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-800 mb-3">
              ArenaX
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-4">
              Where Passion Meets Play
            </p>
            <p className="text-md sm:text-lg text-gray-500 mb-8">
              Unleash your inner champion. Join the revolution in sports booking!
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/login"
                onClick={onClose}
                className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-md"
              >
                Login
              </Link>
              <Link
                to="/"
                onClick={onClose}
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-md"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LandingModal;
