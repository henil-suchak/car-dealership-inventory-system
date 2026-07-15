import React, { useState } from 'react';
import Modal from '../ui/Modal';

const PurchaseAgreementModal = ({ isOpen, vehicle, onClose, onConfirm }) => {
  const [signature, setSignature] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  if (!vehicle) return null;

  const handleConfirm = () => {
    if (!agreed) {
      setError('You must agree to the Digital Terms of Acquisition.');
      return;
    }
    if (signature.trim().length < 3) {
      setError('A valid digital signature (full name) is required.');
      return;
    }
    // The purchase is now handled completely securely on the backend via the API call in the parent component!

    onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-zinc-950 p-8 border border-zinc-800 auth-form-container text-white max-w-2xl w-full">
        <h2 className="text-3xl font-light font-serif uppercase tracking-widest mb-6 border-b border-zinc-800 pb-4">
          Acquisition <span className="font-bold text-gray-500">Agreement</span>
        </h2>
        
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 shadow-inner">
             <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-4 border-b border-zinc-800 pb-2">Asset Details</h3>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Model</p>
                   <p className="text-lg font-light">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                </div>
                <div>
                   <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Agreed Valuation</p>
                   <p className="text-lg font-light">${vehicle.price?.toLocaleString(undefined, { minimumFractionDigits: 0 })}</p>
                </div>
                <div className="col-span-2 mt-2">
                   <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">VIN Registration</p>
                   <p className="text-sm font-mono tracking-wider">{vehicle.vin || 'PENDING ASSIGNMENT'}</p>
                </div>
             </div>
          </div>

          <div className="text-xs text-zinc-400 leading-relaxed space-y-3 font-mono">
             <p>I confirm my intention to acquire the asset described above at the agreed valuation. By signing below, I authorize the execution of this legally binding digital acquisition contract.</p>
             <p>I understand that upon completion, an escrow protocol will be initiated and the asset will be assigned exclusively to my client profile.</p>
          </div>

          <hr className="border-zinc-800" />

          {error && <p className="text-xs text-red-500 uppercase tracking-widest font-bold">{error}</p>}

          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                 type="checkbox" 
                 checked={agreed}
                 onChange={(e) => setAgreed(e.target.checked)}
                 className="form-checkbox h-5 w-5 text-black bg-zinc-900 border-zinc-700 rounded-none focus:ring-0 focus:ring-offset-0"
              />
              <span className="text-sm uppercase tracking-widest font-bold text-zinc-300">
                I accept the Client Terms of Service
              </span>
            </label>

            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-zinc-500 mb-2">Digital Signature</label>
              <input 
                 type="text" 
                 placeholder="Type your full legal name"
                 value={signature}
                 onChange={(e) => setSignature(e.target.value)}
                 className="w-full bg-black border border-zinc-800 text-white px-4 py-3 font-serif italic text-lg focus:outline-none focus:border-white transition-colors"
                 style={{ fontFamily: "'Playfair Display', serif" }}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-zinc-800 mt-8">
             <button 
                onClick={onClose}
                className="px-8 py-3 border border-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
             >
               Abort
             </button>
             <button 
                onClick={handleConfirm}
                className="px-8 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
             >
               Sign & Execute Deal
             </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PurchaseAgreementModal;
