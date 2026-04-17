import React from 'react';
import { AlertTriangle, XCircle, Clock4 } from 'lucide-react';

export function StockAlerts() {
  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-red-50 text-red-500 rounded-xl">
            <AlertTriangle size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#111f42] uppercase tracking-widest">STOCK ALERTS BOARD</h3>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">CRITICAL INVENTORY ISSUES & MATERIAL AGING</p>
          </div>
        </div>
        <div className="px-4 py-1.5 bg-[#E3624A] text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-sm shadow-[#E3624A]/30">
          5 ISSUES ACTIVE
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50/50">
        {/* Out of Stock Column */}
        <div className="bg-white rounded-[20px] p-5 border border-red-100/50 shadow-sm">
          <div className="flex justify-between items-center mb-4 px-1">
            <div className="flex items-center gap-2 text-red-500">
              <XCircle size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">LOW/OUT OF STOCK</span>
            </div>
            <span className="text-[9px] font-black text-red-400 bg-red-50 px-2 py-0.5 rounded-full">2 ITEMS</span>
          </div>
          <div className="space-y-3">
            {[
              { id: 'RM-OAK-002', desc: 'Oak Timber at 0. Reorder pending approval.', action: 'RESTOCK' },
              { id: 'FB-VLVT-001', desc: 'Blue Velvet fabric depleted. Halt line 2.', action: 'RESTOCK' }
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-2xl border border-slate-100 bg-white hover:border-red-200 transition-colors">
                <div className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                  <div>
                    <h4 className="text-[11px] font-black text-[#111f42] uppercase tracking-wider">{item.id}</h4>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5 truncate w-32 sm:w-48">{item.desc}</p>
                  </div>
                </div>
                <button className="text-[9px] font-black text-red-500 border border-red-100 px-3 py-1.5 rounded-full uppercase hover:bg-red-50 transition-colors shrink-0">
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Near Expiry / QC Needed Column */}
        <div className="bg-white rounded-[20px] p-5 border border-amber-100/50 shadow-sm">
          <div className="flex justify-between items-center mb-4 px-1">
            <div className="flex items-center gap-2 text-amber-500">
              <Clock4 size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">MATERIAL QC PENDING</span>
            </div>
            <span className="text-[9px] font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">3 ITEMS</span>
          </div>
          <div className="space-y-3">
            {[
              { id: 'CH-GLUE-012', desc: 'Adhesive batch expiring in 3 days. Check.', action: 'INSPECT' },
              { id: 'RM-PINE-003', desc: 'Moisture level warning on arriving batch.', action: 'INSPECT' },
              { id: 'PN-WHT-002', desc: 'White paint lot requires viscosity test.', action: 'INSPECT' }
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-2xl border border-slate-100 bg-white hover:border-amber-200 transition-colors">
                <div className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                  <div>
                    <h4 className="text-[11px] font-black text-[#111f42] uppercase tracking-wider">{item.id}</h4>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5 truncate w-32 sm:w-48">{item.desc}</p>
                  </div>
                </div>
                <button className="text-[9px] font-black text-amber-600 border border-amber-100 px-3 py-1.5 rounded-full uppercase hover:bg-amber-50 transition-colors shrink-0">
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
