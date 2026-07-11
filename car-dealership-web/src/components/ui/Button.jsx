import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  type = 'button', 
  className = '', 
  variant = 'primary',
  ...props 
}) => {
  const baseClasses = 'inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  const variantClasses = {
    primary: 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
    secondary: 'text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500 disabled:bg-gray-50',
    danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300'
  };

  const combinedClassName = `${baseClasses} ${variantClasses[variant]} ${className} ${disabled ? 'cursor-not-allowed opacity-70' : ''}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
