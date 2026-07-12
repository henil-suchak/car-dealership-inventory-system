import React from 'react';
import { Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import Toast from '../ui/Toast';

const AuthLayout = ({ 
  title, 
  subtitleText, 
  subtitleLinkText, 
  subtitleLinkTo, 
  serverError, 
  setServerError, 
  successMessage,
  children 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-black pointer-events-none"></div>
      
      <div className="max-w-md w-full space-y-8 bg-zinc-950 p-10 border border-zinc-800 relative z-10">
        <div className="flex flex-col items-center">
          <h2 className="mt-6 text-center text-3xl font-light font-serif uppercase tracking-widest text-white">
            {title}
          </h2>
          {subtitleText && subtitleLinkText && subtitleLinkTo && (
            <p className="mt-4 text-center text-xs text-zinc-500 uppercase tracking-widest">
              {subtitleText}{' '}
              <Link to={subtitleLinkTo} className="font-bold text-white hover:text-gray-300 transition-colors">
                {subtitleLinkText}
              </Link>
            </p>
          )}
        </div>
        
        {serverError && <Toast message={serverError} type="error" onClose={() => setServerError(null)} />}
        {successMessage && <Toast message={successMessage} type="success" />}

        <div className="auth-form-container">
           {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
