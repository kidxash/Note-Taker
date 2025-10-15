import { Link } from "react-router-dom";
import React, { useEffect } from "react";

function Navbar() {
  // Remove body margin when Navbar mounts
  useEffect(() => {
    document.body.style.margin = "0";
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-yellow-600 to-orange-900 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-white text-2xl font-bold hover:text-yellow-200 transition-colors duration-200">
              Note-taker
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link 
                to="/" 
                className="text-white hover:bg-orange-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                Home
              </Link>
              <Link 
                to="/create" 
                className="text-white hover:bg-orange-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
              >
                Create
              </Link>
          <Link
            to="/login"
            className="text-white hover:bg-orange-200 block px-3 py-2 rounded-md text-base font-medium"
            >
            Login
          </Link>
              
            </div>
          </div>

          
        </div>
      </div>
    </nav>
  );
}

export default Navbar;