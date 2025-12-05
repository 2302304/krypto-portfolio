import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">💰</span>
              <h1 className="text-2xl font-bold text-primary-600">
                Krypto Portfolio
              </h1>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/portfolio"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium transition-colors"
                >
                  Portfolio
                </Link>
                <Link
                  to="/transactions"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium transition-colors"
                >
                  Transaktiot
                </Link>
                <Link
                  to="/market"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium transition-colors"
                >
                  Markkinat
                </Link>
                
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-300">
                  <span className="text-sm text-gray-600">{user?.email}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    Kirjaudu ulos
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium transition-colors"
                >
                  Kirjaudu
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Rekisteröidy
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
