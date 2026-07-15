import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

import axios from 'axios';

const ClientProfilePage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/purchases/my-purchases');
        setOrders(response.data);
      } catch (err) {
        console.error("Failed to fetch purchase history", err);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black pt-32 pb-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        <div className="mb-16 border-b border-zinc-800 pb-8">
           <h2 className="text-4xl md:text-5xl font-light uppercase tracking-widest text-white mb-2 font-serif">
             Client <span className="font-bold text-gray-500">Dossier</span>
           </h2>
           <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-4">
             Identity Verified <span className="bg-white rounded-full w-2 h-2 inline-block"></span> Secure Connection
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
           
           {/* Profile Details Sidebar */}
           <div className="lg:col-span-1">
              <div className="bg-zinc-950 border border-zinc-800 p-8 space-y-8">
                 <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Authenticated Principal</p>
                    <p className="text-xl font-light font-serif truncate">{user?.email || 'N/A'}</p>
                 </div>
                 
                 <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Access Tier</p>
                    <p className="text-sm font-mono tracking-wider">{user?.isAdmin ? 'ENTERPRISE ADMINISTRATOR' : 'VIP CLIENT'}</p>
                 </div>

                 <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Acquisitions</p>
                    <p className="text-3xl font-light">{orders.length}</p>
                 </div>

                 <hr className="border-zinc-800" />
                 
                 <div className="text-xs text-zinc-400 leading-relaxed font-mono">
                    <p>This terminal is end-to-end encrypted. All fleet telemetry and acquisition documents are stored offline in cold storage for maximum confidentiality.</p>
                 </div>

                 <button className="w-full py-4 border border-zinc-700 text-white uppercase tracking-widest text-xs font-bold hover:bg-zinc-800 transition-all mt-4">
                    Request Concierge Callback
                 </button>
              </div>
           </div>

           {/* Acquisition History */}
           <div className="lg:col-span-2">
              <h3 className="text-2xl font-light font-serif mb-8 flex justify-between items-end border-b border-zinc-800 pb-4">
                 Acquisition <span className="font-bold text-gray-500 ml-2">History</span>
              </h3>

              {orders.length === 0 ? (
                 <div className="text-center py-20 bg-zinc-950 border border-dashed border-zinc-800 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center font-serif text-2xl font-bold mb-6">
                       !
                    </div>
                    <p className="text-zinc-500 uppercase tracking-widest font-bold text-sm mb-4">No Asset Acquisitions On Record</p>
                    <Link to="/" className="text-xs border-b border-white hover:text-zinc-400 hover:border-zinc-400 transition-colors">Return to Showroom</Link>
                 </div>
              ) : (
                 <div className="space-y-6">
                    {orders.map(order => (
                       <div key={order.id} className="bg-zinc-950 border border-zinc-800 hover:border-zinc-600 transition-colors p-8 flex flex-col md:flex-row gap-8 justify-between">
                          <div className="flex-1 space-y-4">
                             <div className="flex gap-4 items-center mb-6">
                               <p className="text-[10px] bg-white text-black px-2 py-1 uppercase tracking-widest font-bold">EXECUTED</p>
                               <p className="text-xs font-mono text-zinc-400">{new Date(order.date).toLocaleString()}</p>
                             </div>
                             
                             <h4 className="text-2xl font-serif font-light">{order.model}</h4>
                             
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                   <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Contract ID</p>
                                   <p className="text-sm font-mono">{order.id}</p>
                                </div>
                                <div>
                                   <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">VIN Assigned</p>
                                   <p className="text-sm font-mono">{order.vin || 'N/A'}</p>
                                </div>
                                <div>
                                   <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Valuation</p>
                                   <p className="text-lg font-light">${order.price?.toLocaleString(undefined, { minimumFractionDigits: 0 })}</p>
                                </div>
                                <div>
                                   <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Digital Signature</p>
                                   <p className="text-lg font-serif italic text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{order.signature}</p>
                                </div>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              )}
           </div>

        </div>
      </div>
    </div>
  );
};

export default ClientProfilePage;
