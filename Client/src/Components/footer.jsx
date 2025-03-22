import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-4 border-t border-gray-300 mt-10">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600 text-xs sm:text-sm">
          © {new Date().getFullYear()} ArenaX. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
