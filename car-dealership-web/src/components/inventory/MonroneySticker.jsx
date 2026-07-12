import React from 'react';

const MonroneySticker = ({ vehicle, dealership }) => {
  if (!vehicle) return null;

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto border-4 border-slate-800 shadow-xl print:shadow-none print:border-none print:m-0 print:p-0">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b-4 border-slate-800 pb-4 mb-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">{vehicle.make} {vehicle.model}</h1>
          <p className="text-xl font-bold text-slate-600 uppercase tracking-widest">{vehicle.year} • {vehicle.trimLevel || 'Standard'}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-sm uppercase">Vehicle Identification Number</p>
          <p className="font-mono text-xl tracking-widest border border-slate-300 p-1 inline-block mt-1">{vehicle.vin}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        
        {/* Left Column: Standard Equipment */}
        <div className="col-span-2">
          <div className="bg-slate-100 p-2 font-bold uppercase tracking-wider mb-2 border-b-2 border-slate-800">
            Standard Equipment
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-bold uppercase text-sm border-b border-slate-300 pb-1 mb-2">Mechanical & Performance</h3>
              <ul className="text-sm space-y-1 list-disc pl-4">
                <li>{vehicle.engineType || 'Standard Engine'}</li>
                <li>{vehicle.transmission || 'Standard Transmission'}</li>
                <li>Front-Wheel Drive (estimated)</li>
                <li>4-Wheel Disc Brakes</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold uppercase text-sm border-b border-slate-300 pb-1 mb-2">Safety & Convenience</h3>
              <ul className="text-sm space-y-1 list-disc pl-4">
                <li>Advanced Airbag System</li>
                <li>Anti-lock Brake System (ABS)</li>
                <li>Tire Pressure Monitoring System</li>
                <li>Backup Camera</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold uppercase text-sm border-b border-slate-300 pb-1 mb-2">Exterior & Interior</h3>
              <ul className="text-sm space-y-1 list-disc pl-4">
                <li>Color: {vehicle.color || 'Standard'}</li>
                <li>LED Headlights</li>
                <li>Premium Fabric/Leatherette Trim</li>
                <li>Auto Climate Control</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & EPA */}
        <div className="flex flex-col border-l-2 border-slate-800 pl-8">
          
          <div className="bg-slate-100 p-2 font-bold uppercase tracking-wider mb-2 border-b-2 border-slate-800">
            Pricing
          </div>
          
          <div className="flex justify-between items-end mb-2">
            <span className="font-bold text-sm uppercase">Base MSRP</span>
            <span className="font-mono">${(vehicle.price * 0.9).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
          
          <div className="flex justify-between items-end mb-2 text-sm">
            <span>Destination Charge</span>
            <span className="font-mono">$1,095.00</span>
          </div>
          
          <div className="flex justify-between items-end mb-2 text-sm text-slate-500">
            <span>Options & Accessories</span>
            <span className="font-mono">${(vehicle.price * 0.1 - 1095).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
          
          <div className="mt-auto border-t-4 border-slate-800 pt-4 flex justify-between items-center bg-slate-50 p-3">
            <span className="font-black uppercase text-xl">Total MSRP*</span>
            <span className="font-black font-mono text-2xl">${vehicle.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
          
          {/* EPA Section */}
          <div className="mt-8 border-4 border-slate-800 p-4 relative text-center">
             <h3 className="font-black uppercase text-lg border-b-2 border-slate-800 pb-2 mb-2">EPA Fuel Economy</h3>
             <div className="flex justify-center items-center gap-4 py-4">
               <div className="text-center">
                 <p className="text-3xl font-black">28</p>
                 <p className="text-xs uppercase font-bold">City</p>
               </div>
               <div className="text-center">
                 <p className="text-5xl font-black text-emerald-600">32</p>
                 <p className="text-xs uppercase font-bold text-emerald-700">Combined mpg</p>
               </div>
               <div className="text-center">
                 <p className="text-3xl font-black">39</p>
                 <p className="text-xs uppercase font-bold">Highway</p>
               </div>
             </div>
          </div>
          
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-8 pt-4 border-t-2 border-slate-300 flex justify-between text-xs text-slate-500 uppercase">
        <p>Delivered to: {dealership?.name || 'Local Authorized Dealership'}</p>
        <p>Mileage: {vehicle.mileage ? vehicle.mileage.toLocaleString() : 'New'}</p>
      </div>

    </div>
  );
};

export default MonroneySticker;
