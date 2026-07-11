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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Car className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
          {subtitleText && subtitleLinkText && subtitleLinkTo && (
            <p className="mt-2 text-center text-sm text-gray-600">
              {subtitleText}{' '}
              <Link to={subtitleLinkTo} className="font-medium text-blue-600 hover:text-blue-500">
                {subtitleLinkText}
              </Link>
            </p>
          )}
        </div>
        
        {serverError && <Toast message={serverError} type="error" onClose={() => setServerError(null)} />}
        {successMessage && <Toast message={successMessage} type="success" />}

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
