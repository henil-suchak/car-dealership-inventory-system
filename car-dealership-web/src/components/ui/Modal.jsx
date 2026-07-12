import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/80 transition-all duration-500" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="w-full max-w-2xl mx-auto relative animate-in zoom-in-95 duration-200">
         {title && (
            <div className="bg-zinc-950 px-8 pt-8 border-t border-l border-r border-zinc-800">
               <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
                  <h3 id="modal-title" className="text-xl font-light font-serif text-white uppercase tracking-widest">{title}</h3>
                  <button onClick={onClose} className="text-zinc-500 hover:text-white">✕</button>
               </div>
            </div>
         )}
         <div className="relative">
            {!title && (
               <button onClick={onClose} className="absolute top-6 right-6 z-10 text-zinc-500 hover:text-white text-xl">✕</button>
            )}
            {children}
         </div>
      </div>
    </div>
  );
};

export default Modal;
