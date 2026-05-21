import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { written } from "../API/API";

function Navbar() {
  const navigate = useNavigate();
  const { logout: apiLogout, isLoggedIn } = written();

  // Remove body margin when Navbar mounts
  useEffect(() => {
    document.body.style.margin = "0";
  }, []);

  const handleLogout = async () => {
    try {
      const result = await apiLogout();
      
      if (result.success) {
        console.log('Logout successful');
        // Redirect to login page
        navigate('/login');
      } else {
        console.error('Logout failed:', result.message);
        // Still redirect to clear frontend state
        navigate('/login');
      }
    } catch (error) {
      console.error("Logout failed:", error);
      // Still redirect even if there's an error
      navigate('/login');
    }
  };

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
              {isLoggedIn && (
                <Link 
                  to="/create" 
                  className="text-white hover:bg-orange-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Create
                </Link>
              )}
              {!isLoggedIn && (
                <Link
                  to="/login"
                  className="text-white hover:bg-orange-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Login
                </Link>
              )}
              {isLoggedIn && (
                <button 
                  onClick={handleLogout}
                  className="text-white hover:bg-orange-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 cursor-pointer"
                >
                  Logout
                </button>
              )}
            </div>
          </div>

          
        </div>
      </div>
    </nav>
  );
}

export default Navbar;