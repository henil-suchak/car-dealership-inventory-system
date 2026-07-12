import React, { useState } from 'react';
import axios from 'axios';

const FinanceCalculator = ({ basePrice }) => {
  const [downPayment, setDownPayment] = useState(basePrice * 0.1);
  const [tradeIn, setTradeIn] = useState(0);
  const [months, setMonths] = useState(60);
  const [interestRate, setInterestRate] = useState(4.99);
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const resp = await axios.post('/api/finance/calculate', {
        vehiclePrice: basePrice,
        downPayment,
        tradeInValue: tradeIn,
        termMonths: months,
        interestRate
      });
      setResult(resp.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 text-white shadow-2xl font-sans mt-8">
      <h3 className="text-2xl font-serif mb-6 text-gray-200 tracking-wide font-light border-b border-zinc-800 pb-4">
        Deal <span className="font-bold text-white">Calculator</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold tracking-widest text-gray-400 mb-2 uppercase">Vehicle Price</label>
            <div className="px-4 py-3 bg-zinc-950 text-gray-300 rounded border border-zinc-800">
              ${Number(basePrice).toLocaleString()}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold tracking-widest text-gray-400 mb-2 uppercase">Down Payment</label>
            <input 
              type="number" 
              className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded text-white focus:outline-none focus:border-gray-500 transition-colors"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold tracking-widest text-gray-400 mb-2 uppercase">Trade-In Value</label>
            <input 
              type="number" 
              className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded text-white focus:outline-none focus:border-gray-500 transition-colors"
              value={tradeIn}
              onChange={(e) => setTradeIn(Number(e.target.value))}
            />
          </div>

          <div className="flex gap-4">
             <div className="flex-1">
               <label className="block text-sm font-semibold tracking-widest text-gray-400 mb-2 uppercase">Term (Months)</label>
               <select 
                 className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded text-white focus:outline-none focus:border-gray-500 transition-colors"
                 value={months}
                 onChange={(e) => setMonths(Number(e.target.value))}
               >
                 <option value={36}>36 Months</option>
                 <option value={48}>48 Months</option>
                 <option value={60}>60 Months</option>
                 <option value={72}>72 Months</option>
               </select>
             </div>
             
             <div className="flex-1">
               <label className="block text-sm font-semibold tracking-widest text-gray-400 mb-2 uppercase">Rate (%)</label>
               <input 
                 type="number" 
                 step="0.01"
                 className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded text-white focus:outline-none focus:border-gray-500 transition-colors"
                 value={interestRate}
                 onChange={(e) => setInterestRate(Number(e.target.value))}
               />
             </div>
          </div>
          
          <button 
             onClick={calculate}
             className="w-full py-4 mt-4 bg-white text-black text-sm uppercase tracking-widest font-bold hover:bg-gray-200 transition-colors"
          >
             {loading ? 'Calculating...' : 'Calculate Deal'}
          </button>
        </div>

        <div className="bg-zinc-950 rounded-xl p-8 border border-zinc-800 flex flex-col justify-center items-center text-center">
          {result ? (
            <div className="space-y-8 w-full animate-in fade-in duration-500">
               <div>
                  <p className="text-gray-400 uppercase tracking-widest text-xs font-semibold mb-2">Estimated Monthly Payment</p>
                  <p className="text-5xl font-light font-serif text-white">${result.monthlyPayment.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</p>
               </div>
               
               <div className="w-full h-px bg-zinc-800"></div>
               
               <div className="grid grid-cols-2 gap-4 text-left">
                 <div>
                    <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Principal Amount</p>
                    <p className="text-gray-300 font-medium">${result.principalAmount.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
                 </div>
                 <div>
                    <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Total Interest</p>
                    <p className="text-gray-300 font-medium">${result.totalInterestPaid.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
                 </div>
               </div>
               
               <div className="bg-zinc-900 border border-zinc-800 p-4 rounded text-left">
                  <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Total Cost to Buyer</p>
                  <p className="text-white font-bold text-xl">${result.totalCostToBuyer.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
               </div>
            </div>
          ) : (
            <div className="text-zinc-600">
               <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
               </svg>
               <p className="uppercase tracking-widest text-xs font-semibold">Enter details and calculate to view structured deal</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinanceCalculator;
