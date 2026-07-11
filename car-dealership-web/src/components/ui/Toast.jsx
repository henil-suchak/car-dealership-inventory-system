import React from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  const bgColors = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700'
  };

  return (
    <div role="alert" className={`flex items-center justify-between p-4 mb-4 border rounded-md shadow-sm ${bgColors[type]}`}>
      <div>{message}</div>
      {onClose && (
        <button onClick={onClose} className="ml-4 focus:outline-none" aria-label="Close alert">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Toast;
