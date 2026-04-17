import React from 'react';
import { ArrowDownToLine, Truck, Database, ClipboardCheck } from 'lucide-react';

export function KpiCards() {
  const kpis = [
    { label: 'TODAY INBOUND', val: '450', sub: 'RECEIVED UNITS', icon: ArrowDownToLine, bg: 'bg-emerald-50', color: '#10b981' },
    { label: 'TODAY OUTBOUND', val: '380', sub: 'DISPATCHED UNITS', icon: Truck, bg: 'bg-blue-50', color: '#3b82f6' },
    { label: 'INV. VALUE', val: '฿12.4M', sub: 'TOTAL STOCK HOLDING', icon: Database, bg: 'bg-amber-50', color: '#ab8a3b', trend: '↗ + 2.4%' },
    { label: 'CAPACITY', val: '78.5%', sub: 'SPACE UTILIZATION', icon: ClipboardCheck, bg: 'bg-slate-100', color: '#111f42' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {kpis.map((kpi, i) => {
        const KpiIcon = kpi.icon;
        return (
          <div key={i} className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 flex flex-col justify-between min-h-[120px] hover:shadow-md transition-shadow relative overflow-hidden">
            <div 
              className="absolute -right-4 -bottom-4 opacity-[0.08] pointer-events-none transform -rotate-[15deg]"
              style={{ color: kpi.color }}
            >
              <KpiIcon size={110} strokeWidth={1.5} />
            </div>
            <div className="flex justify-between items-start relative z-10">
              <h3 className="text-[10px] font-black text-[#111f42] uppercase tracking-widest leading-tight w-24">{kpi.label}</h3>
              <div className={`p-2.5 rounded-[14px] ${kpi.bg}`} style={{ color: kpi.color }}>
                <KpiIcon size={18} strokeWidth={2.5} />
              </div>
            </div>
            <div className="relative z-10 mt-2">
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-black text-[#111f42] font-mono tracking-tighter leading-none">{kpi.val}</div>
                {kpi.trend && <span className="text-[10px] font-bold text-emerald-500 font-mono">{kpi.trend}</span>}
              </div>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2">{kpi.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
