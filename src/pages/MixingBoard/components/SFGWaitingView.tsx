import React, { useState, useEffect } from 'react';
import { MOCK_WAITING_SFG } from '../constants';
import { BatchDetailModal } from './BatchDetailModal';
import { RefreshCcw, PackageOpen } from 'lucide-react';

export const SFGWaitingView = () => {
    const [now, setNow] = useState(new Date());
    const [selectedSFG, setSelectedSFG] = useState(null);
    useEffect(() => { const interval = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(interval); }, []);
    
    const formatDelay = (isoTime: string | null) => { 
        if (!isoTime) return { text: '-', isHigh: false }; 
        const finish = new Date(isoTime); 
        const diffMs = now.getTime() - finish.getTime(); 
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60)); 
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); 
        const isHigh = diffHrs >= 4; 
        return { text: `${diffHrs}h ${diffMins}m`, isHigh }; 
    };

    return (
        <div className="w-full font-sans animate-fadeIn flex flex-col h-full min-h-0">
            {selectedSFG && <BatchDetailModal sfg={selectedSFG} onClose={() => setSelectedSFG(null)} />}
            <div className="bg-white/80 backdrop-blur-md rounded-none border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col flex-1 min-h-0">
                <div className="px-6 py-4 border-b border-[#E6E1DB] flex justify-between items-center bg-[#F2F4F6]/50 shrink-0">
                    <h3 className="font-black text-[12px] text-[#2E395F] flex items-center gap-2 uppercase tracking-widest">
                        <PackageOpen size={16} className="text-[#C22D2E]" /> SFG Waiting for Packing
                    </h3>
                    <span className="text-[10px] text-[#737597] font-bold uppercase tracking-widest flex items-center gap-1">
                        <RefreshCcw size={12} /> Auto-refresh
                    </span>
                </div>
                <div className="flex-1 overflow-x-auto custom-scrollbar bg-transparent">
                    <table className="w-full text-left min-w-[900px] border-collapse">
                        <thead className="bg-[#C22D2E] border-b-[3px] border-[#2E395F] sticky top-0 z-10 text-white font-mono uppercase tracking-wider text-[11px] font-black">
                            <tr>
                                <th className="py-3 px-4 pl-6 whitespace-nowrap">SFG Code</th>
                                <th className="py-3 px-4 whitespace-nowrap">Product Name</th>
                                <th className="py-3 px-4 text-center whitespace-nowrap">Batch Set</th>
                                <th className="py-3 px-4 text-center whitespace-nowrap">Location</th>
                                <th className="py-3 px-4 text-right whitespace-nowrap">Weight (Kg)</th>
                                <th className="py-3 px-4 text-center whitespace-nowrap">Delay (Steam)</th>
                                <th className="py-3 px-4 text-center whitespace-nowrap">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#E6E1DB] text-[12px]">
                            {MOCK_WAITING_SFG.map((item) => {
                                const delaySteam = formatDelay(item.steamingFinish);
                                return (
                                    <tr key={item.id} onClick={() => setSelectedSFG(item as any)} className="hover:bg-[#F2F4F6]/80 transition-colors cursor-pointer group">
                                        <td className="px-4 py-2 pl-6 align-middle font-bold text-[#C22D2E] font-mono"><span className="bg-[#C22D2E]/10 px-2 py-0.5 rounded-md border border-[#C22D2E]/20">{item.code}</span></td>
                                        <td className="px-4 py-2 align-middle font-bold text-[#2E395F]">{item.name}</td>
                                        <td className="px-4 py-2 align-middle text-center"><span className="text-[11px] font-mono font-bold bg-[#F2F4F6] border border-[#E6E1DB] text-[#737597] px-2 py-0.5 rounded-md">{item.batchSet}</span></td>
                                        <td className="px-4 py-2 align-middle text-center text-[#55738D] font-bold text-[11px]">{item.location}</td>
                                        <td className="px-4 py-2 align-middle text-right font-mono font-black text-[#2E395F] text-[13px]">{item.weight}</td>
                                        <td className="px-4 py-2 align-middle text-center"><span className={`font-mono font-bold ${delaySteam.isHigh ? 'text-[#C22D2E]' : 'text-[#737597]'}`}>{delaySteam.text}</span></td>
                                        <td className="px-4 py-2 align-middle text-center"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm bg-white text-[#DCBC1B] border-[#DCBC1B]/40">Waiting</span></td>
                                    </tr>
                                );
                            })}
                            {MOCK_WAITING_SFG.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center text-[#737597] font-bold uppercase tracking-widest text-[12px] opacity-50">
                                        No SFG Waiting
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
