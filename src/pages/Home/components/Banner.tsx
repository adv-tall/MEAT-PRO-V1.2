import React from 'react';
import { Warehouse } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export function Banner() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#111f42] tracking-tighter uppercase leading-none">
            WELCOME BACK, <span className="text-[#E3624A]">{user?.name || 'T-DCC DEVELOPER'}</span>
          </h2>
          <p className="text-slate-400 text-[10px] font-black tracking-[0.2em] uppercase mt-1.5">Intelligent Warehouse Hub</p>
        </div>
      </div>

      <div className="relative w-full h-48 rounded-[24px] overflow-hidden shadow-sm group">
        <img 
          src="https://media.istockphoto.com/id/2161721547/photo/business-logistics-warehouse-management-system-technology-concept.jpg?s=612x612&w=0&k=20&c=kg97IF9se5w39XDDvUOB1b6zrNpz3jqaFXKUF91rlnw=" 
          alt="Warehouse Overview" 
          className="absolute inset-0 w-full h-full object-cover object-[center_30%] transition-transform duration-1000 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1726] from-10% via-[#0a1726]/70 via-50% to-transparent"></div>
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-3">
             <Warehouse size={32} className="text-[#ab8a3b]" strokeWidth={1.5} />
             <h2 className="text-3xl md:text-[40px] font-black text-white tracking-widest leading-none uppercase drop-shadow-md">
               WMS COMMAND CENTER
             </h2>
          </div>
          <p className="text-[#F0EEED] font-medium italic text-[11px] md:text-sm max-w-2xl font-mono leading-relaxed opacity-95 pl-12 drop-shadow-md">
            "Streamlining inbound, outbound, and inventory flows. Real-time visibility across all storage zones."
          </p>
        </div>
      </div>
    </div>
  );
}
