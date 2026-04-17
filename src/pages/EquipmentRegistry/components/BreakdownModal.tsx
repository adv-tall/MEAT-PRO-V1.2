import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { LucideIcon } from '../../../components/shared/SharedUI';
import { StandardModalWrapper } from '../../../components/shared/StandardModalWrapper';

export function BreakdownModal({ isOpen, onClose, data, onSave, equipment }: any) {
    const [formData, setFormData] = useState({ machineId: '', problem: '', actionTaken: '', downtimeMinutes: 0, status: 'Open' });

    useEffect(() => {
        if (isOpen) {
            setFormData(data ? { ...data } : { machineId: '', problem: '', actionTaken: '', downtimeMinutes: 0, status: 'Open' });
        }
    }, [isOpen, data]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!formData.machineId || !formData.problem) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Machine and Problem are required.' });
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#141619]/60 backdrop-blur-sm p-4 animate-fadeIn font-sans">
            <StandardModalWrapper className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden relative border border-white/40 max-h-[90vh]">
                <div className="bg-[#2E395F] px-8 py-5 flex justify-between items-center shrink-0 border-b border-[#E6E1DB] modal-handle cursor-move">
                    <div className="flex items-center gap-4 pointer-events-none">
                        <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20">
                            <LucideIcon name={data ? "edit-3" : "alert-triangle"} size={20} className={!data ? "text-[#DCBC1B]" : ""} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">{data ? 'Edit Breakdown Record' : 'Report Machine Issue'}</h3>
                            <p className="text-[10px] font-bold text-[#90B7BF] uppercase tracking-widest mt-1.5">{data ? data.id : 'Create new maintenance log'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-lg"><LucideIcon name="x" size={20} /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#F2F4F6]">
                    <div className="bg-white p-6 rounded-2xl border border-[#E6E1DB] shadow-sm grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Machine</label>
                            <select 
                                value={formData.machineId} 
                                onChange={(e) => setFormData({...formData, machineId: e.target.value})}
                                className="w-full border border-[#B2CADE] bg-[#F2F4F6] focus:bg-white rounded-xl p-3 text-[12px] font-bold text-[#2E395F] focus:border-[#C22D2E] transition-all outline-none cursor-pointer"
                            >
                                <option value="">-- Select Machine --</option>
                                {equipment.map((eq: any) => (
                                    <option key={eq.id} value={eq.id}>{eq.name} ({eq.step})</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Problem Description</label>
                            <textarea 
                                value={formData.problem} 
                                onChange={(e) => setFormData({...formData, problem: e.target.value})}
                                className="w-full border border-[#B2CADE] bg-[#F2F4F6] focus:bg-white rounded-xl p-3 text-[12px] font-bold text-[#2E395F] focus:border-[#C22D2E] transition-all outline-none min-h-[80px]"
                                placeholder="Describe the issue..."
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Action Taken</label>
                            <textarea 
                                value={formData.actionTaken} 
                                onChange={(e) => setFormData({...formData, actionTaken: e.target.value})}
                                className="w-full border border-[#B2CADE] bg-[#F2F4F6] focus:bg-white rounded-xl p-3 text-[12px] font-bold text-[#2E395F] focus:border-[#C22D2E] transition-all outline-none min-h-[80px]"
                                placeholder="What was done to fix it? (Optional if still open)"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Downtime (Minutes)</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    min="0"
                                    value={formData.downtimeMinutes} 
                                    onChange={(e) => setFormData({...formData, downtimeMinutes: Number(e.target.value) || 0})}
                                    className="w-full border border-[#B2CADE] bg-[#F2F4F6] focus:bg-white rounded-xl p-3 text-[12px] font-mono font-black text-[#C22D2E] text-right pr-12 focus:border-[#C22D2E] transition-all outline-none"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#737597]">MIN</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Status</label>
                            <select 
                                value={formData.status} 
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                                className="w-full border border-[#B2CADE] bg-[#F2F4F6] focus:bg-white rounded-xl p-3 text-[12px] font-bold text-[#2E395F] focus:border-[#C22D2E] transition-all outline-none cursor-pointer"
                            >
                                <option value="Open">Open</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-5 bg-white border-t border-[#E6E1DB] flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="px-6 py-2.5 text-[#737597] hover:text-[#2E395F] font-bold text-[10px] uppercase tracking-widest transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-8 py-2.5 bg-[#C22D2E] hover:bg-[#9E2C21] text-white font-black text-[11px] uppercase tracking-widest rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"><LucideIcon name="save" size={14}/> Save Record</button>
                </div>
            </StandardModalWrapper>
        </div>
    );
}
