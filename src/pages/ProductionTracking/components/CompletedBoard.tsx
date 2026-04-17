import React from 'react';
import { LucideIcon } from '../../../components/shared/SharedUI';

export function CompletedBoard({ data }: any) {
    const completedItems = data.filter((d: any) => d.status === 'Completed');

    return (
        <div className="h-full flex flex-col animate-fadeIn font-sans">
             <div className="mb-6 flex justify-between items-end shrink-0">
                <div>
                    <h2 className="text-xl font-black text-[#2E395F] flex items-center gap-2 uppercase tracking-tight">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-white/60"><LucideIcon name="archive" size={20} color="#537E72" /></div> 
                        COMPLETED JOBS
                    </h2>
                    <p className="text-[10px] text-[#55738D] mt-2 font-bold tracking-widest uppercase">Finished Production Transferred to Warehouse</p>
                </div>
                <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-xl border border-white/60 shadow-sm text-[12px] font-black text-[#737597] uppercase tracking-widest">
                    Total Finished: <span className="text-[#537E72] text-[16px] ml-2 leading-none">{completedItems.length}</span>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {completedItems.map((item: any) => (
                         <div key={item.id} className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 p-5 flex flex-col relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                             <div className="absolute top-0 left-0 w-1.5 h-full bg-[#537E72]"></div>
                             <div className="flex justify-between items-start mb-3 pl-2">
                                 <span className="text-[10px] px-2 py-0.5 rounded bg-[#F2F4F6] text-[#55738D] font-bold font-mono border border-[#E6E1DB]">{item.id}</span>
                                 <span className="text-[9px] bg-[#537E72]/10 text-[#537E72] px-2 py-0.5 rounded border border-[#537E72]/20 font-black uppercase tracking-widest">Finished</span>
                             </div>
                             <h4 className="font-black text-[#2E395F] text-[14px] mb-4 pl-2 truncate" title={item.sku}>{item.sku}</h4>
                             
                             <div className="pl-2 mb-4">
                                 <div className="flex items-center gap-2 text-[11px] text-[#55738D] mb-1 font-bold">
                                     <LucideIcon name="package-check" size={14} className="text-[#537E72]"/>
                                     <span>Total Output: <b className="text-[#2E395F] text-[14px] ml-1">{item.totalBatches}</b> Batches</span>
                                 </div>
                                 <div className="flex items-center gap-2 text-[10px] text-[#737597] font-mono">
                                     <LucideIcon name="clock" size={12}/>
                                     <span>Finished: {item.lastUpdated || 'Unknown'}</span>
                                 </div>
                             </div>

                             <div className="mt-auto pl-2 pt-4 border-t border-[#E6E1DB]">
                                 <button className="w-full py-2.5 rounded-xl border border-[#E6E1DB] text-[#55738D] text-[10px] font-black uppercase tracking-widest hover:bg-[#2E395F] hover:text-white hover:border-[#2E395F] transition-all flex items-center justify-center gap-2 shadow-sm">
                                     <LucideIcon name="file-text" size={14}/> View Summary
                                 </button>
                             </div>
                         </div>
                     ))}
                     {completedItems.length === 0 && (
                        <div className="col-span-full h-64 flex flex-col items-center justify-center text-[#737597] opacity-50 bg-white/40 rounded-3xl border border-white/60">
                            <LucideIcon name="archive-x" size={60} className="mb-4 text-[#C22D2E]"/>
                            <span className="font-black uppercase tracking-widest text-[12px]">No completed jobs yet today.</span>
                        </div>
                     )}
                 </div>
             </div>
        </div>
    );
}
