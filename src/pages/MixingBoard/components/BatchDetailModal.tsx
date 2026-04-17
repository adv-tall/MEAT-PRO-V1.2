import React from 'react';
import { DraggableModal } from '../../../components/shared/DraggableModal';

export const BatchDetailModal = ({ sfg, onClose }: any) => {
    if (!sfg) return null;
    const batchCount = Math.ceil(sfg.weight / 150);
    const batches = Array.from({ length: batchCount }, (_, i) => ({
        id: i + 1,
        weight: (sfg.weight / batchCount).toFixed(1),
        temp: (4 + Math.random()).toFixed(1),
        qc: 'Pass',
        time: new Date(new Date(sfg.steamingFinish).getTime() + (i * 15 * 60000)).toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})
    }));

    return (
        <DraggableModal
            isOpen={!!sfg}
            onClose={onClose}
            title={`Batch Details: ${sfg.batchSet}`}
            width="max-w-2xl"
        >
            <div className="p-8 bg-[#F2F4F6] flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl border border-[#E6E1DB] shadow-sm">
                        <p className="text-[10px] uppercase text-[#737597] font-black tracking-widest mb-1">Total Weight</p>
                        <p className="text-2xl font-black text-[#2E395F] font-mono">{sfg.weight} <span className="text-[12px] font-bold text-[#55738D]">KG</span></p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[#E6E1DB] shadow-sm">
                        <p className="text-[10px] uppercase text-[#737597] font-black tracking-widest mb-1">Location</p>
                        <p className="text-lg font-black text-[#2E395F] truncate leading-tight mt-1">{sfg.location}</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl border border-[#E6E1DB] shadow-sm overflow-hidden">
                    <div className="px-5 py-3 bg-[#55738D] text-white">
                        <h4 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">Batches Breakdown</h4>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left min-w-[500px] border-collapse">
                            <thead className="bg-[#F2F4F6] text-[#2E395F] font-black uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="p-3 pl-5">Batch #</th>
                                    <th className="p-3 text-right">Weight (Kg)</th>
                                    <th className="p-3 text-center">Core Temp (°C)</th>
                                    <th className="p-3 text-center">Finish Time</th>
                                    <th className="p-3 pr-5 text-center">QC</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E6E1DB] text-[12px]">
                                {batches.map(b => (
                                    <tr key={b.id} className="hover:bg-[#F2F4F6]/50">
                                        <td className="p-3 pl-5 font-mono font-bold text-[#C22D2E]">#{b.id}</td>
                                        <td className="p-3 text-right font-mono text-[#2E395F] font-bold">{b.weight}</td>
                                        <td className="p-3 text-center font-mono font-bold text-[#55738D]">{b.temp}</td>
                                        <td className="p-3 text-center text-[#737597] font-mono">{b.time}</td>
                                        <td className="p-3 pr-5 text-center">
                                            <span className="bg-[#537E72]/10 text-[#537E72] border border-[#537E72]/30 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm">PASS</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="p-5 bg-white border-t border-[#E6E1DB] flex justify-end shrink-0">
                <button onClick={onClose} className="px-8 py-2.5 bg-[#2E395F] text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#141619] transition-colors shadow-sm">Close</button>
            </div>
        </DraggableModal>
    );
};
