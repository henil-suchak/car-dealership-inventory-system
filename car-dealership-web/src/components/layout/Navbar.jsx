import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 shadow-2xl transition-all">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 text-white font-serif font-light text-2xl tracking-widest uppercase">
              LUX<span className="font-bold">AUTO</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            {!user ? (
              <>
                <Link to="/login" className="text-gray-400 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors">
                  Client Login
                </Link>
                <Link to="/register" className="px-5 py-2.5 border border-white/20 hover:border-white text-white text-xs font-bold tracking-widest uppercase transition-colors bg-white/5">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="text-gray-400 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-gray-400 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors">
                  Profile
                </Link>
                <span className="text-xs text-zinc-500 font-mono hidden sm:inline-block border-l border-zinc-800 pl-6">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 bg-white text-black hover:bg-gray-200 text-xs font-bold tracking-widest uppercase transition-colors ml-2"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
