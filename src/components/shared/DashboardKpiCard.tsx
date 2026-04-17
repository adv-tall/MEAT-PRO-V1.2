import React from 'react';
import { LucideIcon } from './SharedUI';

export const KPICard = ({ title, val, color, icon, desc, unit, trend }: any) => (
  <div className="bg-white/60 backdrop-blur-md rounded-xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/50 flex flex-col justify-center h-28 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
    <div className="flex justify-between items-center z-10 h-full">
      <div className="flex flex-col justify-center gap-1">
        <p className="text-[10px] font-black text-[#737597] uppercase tracking-widest">{title}</p>
        <div className="flex items-end gap-3">
          <h3 className="text-3xl font-black text-[#2E395F] font-mono leading-none">{val} <span className="text-[14px] text-[#737597]">{unit}</span></h3>
          <div className="flex items-center gap-1.5 mb-1">
             <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }}></div>
             <p className="text-[9px] font-bold text-[#55738D] uppercase tracking-widest leading-none flex items-center gap-1">
                  {trend === 'up' && <LucideIcon name="trending-up" size={12} color="#537E72" />}
                  {trend === 'down' && <LucideIcon name="trending-down" size={12} color="#C22D2E" />}
                  {desc}
             </p>
          </div>
        </div>
      </div>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-white/80 to-transparent shadow-sm border border-white/80 shrink-0" style={{ backgroundColor: color + '20' }}>
        <LucideIcon name={icon} size={20} style={{ color: color }} strokeWidth={2.5} />
      </div>
    </div>
    <div className="absolute -right-4 -bottom-4 opacity-[0.04] pointer-events-none group-hover:scale-110 group-hover:rotate-[5deg] transition-all duration-700 z-0">
      <LucideIcon name={icon} size={100} style={{ color: color }} />
    </div>
  </div>
);
