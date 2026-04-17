import React from 'react';
import { LucideIcon } from '../../../components/shared/SharedUI';

export function PackingQueueBoard({ data }: any) {
    const queueItems = data.filter((d: any) => 
        d.status !== 'Completed' && 
        (d.stages.cutting > d.stages.packing)
    ).map((item: any) => ({
        ...item,
        readyToPack: item.stages.cutting - item.stages.packing,
        packed: item.stages.packing
    }));

    return (
        <div className="h-full flex flex-col animate-fadeIn font-sans">
             <div className="mb-6 flex justify-between items-end shrink-0">
                <div>
                    <h2 className="text-xl font-black text-[#2E395F] flex items-center gap-2 uppercase tracking-tight">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-white/60"><LucideIcon name="package-open" size={20} color="#DCBC1B" /></div> 
                        PACKING QUEUE
                    </h2>
                    <p className="text-[10px] text-[#55738D] mt-2 font-bold tracking-widest uppercase">Items Ready for Final Packaging</p>
                </div>
                <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-xl border border-white/60 shadow-sm text-[12px] font-black text-[#737597] uppercase tracking-widest">
                    Pending Items: <span className="text-[#DCBC1B] text-[16px] ml-2 leading-none">{queueItems.length}</span>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {queueItems.map((item: any) => (
                         <div key={item.id} className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 p-5 flex flex-col relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                             <div className="absolute top-0 left-0 w-1.5 h-full bg-[#DCBC1B]"></div>
                             <div className="flex justify-between items-start mb-3 pl-2">
                                 <span className="text-[10px] px-2 py-0.5 rounded bg-[#F2F4F6] text-[#55738D] font-bold font-mono border border-[#E6E1DB]">{item.id}</span>
                                 <span className="text-[9px] bg-[#DCBC1B]/10 text-[#B06821] px-2 py-0.5 rounded border border-[#DCBC1B]/30 font-black uppercase tracking-widest">Ready to Pack</span>
                             </div>
                             <h4 className="font-black text-[#2E395F] text-[14px] mb-5 pl-2 truncate" title={item.sku}>{item.sku}</h4>
                             
                             <div className="grid grid-cols-2 gap-3 pl-2">
                                 <div className="bg-[#F2F4F6]/80 p-3 rounded-xl border border-[#E6E1DB] text-center shadow-inner">
                                     <span className="block text-[9px] text-[#737597] font-bold uppercase tracking-widest mb-1">Ready</span>
                                     <span className="block text-[20px] font-black text-[#DCBC1B] leading-none">{item.readyToPack}</span>
                                 </div>
                                 <div className="bg-[#F2F4F6]/80 p-3 rounded-xl border border-[#E6E1DB] text-center shadow-inner">
                                     <span className="block text-[9px] text-[#737597] font-bold uppercase tracking-widest mb-1">Packed</span>
                                     <span className="block text-[20px] font-black text-[#55738D] leading-none">{item.packed}</span>
                                 </div>
                             </div>
                             
                             <div className="mt-5 pl-2 pt-4 border-t border-[#E6E1DB] flex justify-between items-center text-[10px] font-bold text-[#737597] uppercase tracking-widest">
                                 <span>Target: {item.totalBatches}</span>
                                 <span className="text-[#55738D] font-black">{Math.round((item.packed/item.totalBatches)*100)}% Done</span>
                             </div>
                         </div>
                     ))}
                     {queueItems.length === 0 && (
                        <div className="col-span-full h-64 flex flex-col items-center justify-center text-[#737597] opacity-50 bg-white/40 rounded-3xl border border-white/60">
                            <LucideIcon name="check-circle" size={60} className="mb-4 text-[#537E72]"/>
                            <span className="font-black uppercase tracking-widest text-[12px]">All processed items have been packed.</span>
                        </div>
                     )}
                 </div>
             </div>
        </div>
    );
}
