import React from 'react';
import { CheckSquare, ArrowDownToLine, Package, Truck, ArrowUpRight, AlertOctagon, AlertTriangle } from 'lucide-react';

export function PendingTasks() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Pending Tasks */}
      <div className="lg:col-span-2 bg-white rounded-[24px] shadow-sm border border-slate-100 p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
              <CheckSquare size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#111f42] uppercase tracking-widest">PENDING TASKS</h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">WAREHOUSE QUEUE MONITOR</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-orange-500 text-white text-[9px] font-black rounded-full uppercase tracking-wider">
            3 ACTIVE TASKS
          </div>
        </div>

        <div className="space-y-4">
          {[
            { dept: 'INBOUND DEPT', id: 'PO-2024-089', issue: 'WAITING RECEIPT', sub: 'OAK BOARD 20MM', status: 'PENDING' },
            { dept: 'OUTBOUND DEPT', id: 'SO-2024-085', issue: 'PICKING LIST', sub: 'LEATHER SOFA SET A', status: 'IN PROGRESS' },
            { dept: 'LOGISTICS TEAM', id: 'DO-2024-042', issue: 'ROUTE ASSIGN', sub: 'DELIVERY BKK ZONE', status: 'READY' }
          ].map((task, i) => (
            <div key={i} className="flex justify-between items-center p-4 rounded-[20px] border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[14px] bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                  {i === 0 ? <ArrowDownToLine size={18}/> : i === 1 ? <Package size={18}/> : <Truck size={18}/>}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[11px] font-black text-[#111f42] uppercase tracking-wider">{task.dept}</h4>
                    <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded uppercase">{task.id}</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.issue} <span className="mx-1">•</span> {task.sub}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-500 border border-slate-200 px-3 py-1.5 rounded-full uppercase">{task.status}</span>
                <ArrowUpRight size={16} className="text-slate-300 group-hover:text-[#111f42] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Alert */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-4 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-pink-50 text-pink-500 rounded-lg">
            <AlertOctagon size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#111f42] uppercase tracking-widest">SYSTEM ALERT</h3>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">CRITICAL FEED</p>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="p-5 rounded-[20px] bg-red-50/50 border border-red-100">
            <div className="flex items-center gap-2 text-red-500 mb-3">
              <AlertTriangle size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">SERVER MAINTENANCE</span>
            </div>
            <p className="text-[11px] font-mono font-medium text-slate-600 leading-relaxed">
              Database optimization starts Sunday 2:00 AM. Ensure all offline syncs are completed.
            </p>
          </div>

          <div className="p-5 rounded-[20px] bg-orange-50/50 border border-orange-100">
            <div className="flex items-center gap-2 text-orange-600 mb-3">
              <Package size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">NEW FEATURE UPDATE</span>
            </div>
            <p className="text-[11px] font-mono font-medium text-slate-600 leading-relaxed">
              Barcode scanning via mobile app for Inventory Counting is now available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
