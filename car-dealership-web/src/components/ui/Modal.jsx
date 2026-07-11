import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <h3 id="modal-title" className="text-lg font-medium text-gray-900">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 text-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
