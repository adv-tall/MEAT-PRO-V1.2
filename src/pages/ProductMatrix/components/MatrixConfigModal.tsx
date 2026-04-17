import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { LucideIcon } from '../../../components/shared/SharedUI';
import { StandardModalWrapper } from '../../../components/shared/StandardModalWrapper';

export function MatrixConfigModal({ isOpen, onClose, sfgData, onSave, batters, fgDatabase }: any) {
    const [formData, setFormData] = useState<any>(null);
    const [selectedFgSku, setSelectedFgSku] = useState('');
    const [selectedBatterId, setSelectedBatterId] = useState('');

    useEffect(() => {
        if (isOpen && sfgData) {
            const data = JSON.parse(JSON.stringify(sfgData));
            if (!data.batterConfig) data.batterConfig = data.batterId ? [{ id: data.batterId, ratio: 100 }] : [];
            setFormData(data); 
        } else if (isOpen) {
            setFormData({ id: '', name: '', batterConfig: [], fgs: [] }); 
        }
        setSelectedFgSku(''); setSelectedBatterId('');
    }, [isOpen, sfgData]);

    if (!isOpen || !formData) return null;

    const totalRatio = formData.batterConfig.reduce((acc: number, curr: any) => acc + (parseFloat(String(curr.ratio)) || 0), 0);
    const isRatioValid = Math.abs(totalRatio - 100) < 0.1;

    const handleSave = () => {
        if (formData.batterConfig.length > 0 && !isRatioValid) { 
            Swal.fire({ icon: 'warning', title: 'Ratio Mismatch', text: `Total ratio is ${totalRatio}%. It must be 100%.` }); 
            return; 
        }
        onSave(formData); onClose();
    };

    const handleAddBatter = () => {
        if (selectedBatterId && !formData.batterConfig.some((b: any) => b.id === selectedBatterId)) {
            const currentTotal = formData.batterConfig.reduce((acc: number, curr: any) => acc + (parseFloat(String(curr.ratio)) || 0), 0);
            const remaining = Math.max(0, 100 - currentTotal);
            setFormData({ ...formData, batterConfig: [...formData.batterConfig, { id: selectedBatterId, ratio: remaining }] });
            setSelectedBatterId('');
        }
    };

    const handleAddFgFromDb = () => {
        if (!selectedFgSku) return;
        const fgMaster = fgDatabase.find((f: any) => f.sku === selectedFgSku);
        if (fgMaster) {
            if (formData.fgs.some((f: any) => f.sku === fgMaster.sku)) { 
                Swal.fire({ icon: 'warning', title: 'Duplicate', text: 'SKU already mapped.', timer: 1000 }); 
                return; 
            }
            setFormData({ ...formData, fgs: [...formData.fgs, { sku: fgMaster.sku, name: fgMaster.name, brand: fgMaster.brand, weight: fgMaster.weight, pieces: 0 }] });
            setSelectedFgSku('');
        }
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#141619]/60 backdrop-blur-sm p-4 animate-fadeIn font-sans">
            <StandardModalWrapper className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-white/40">
                <div className="bg-[#2E395F] px-8 py-5 flex justify-between items-center shrink-0 border-b border-[#E6E1DB] modal-handle cursor-move">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3 pointer-events-none"><LucideIcon name="settings-2" className="text-[#DCBC1B]"/> Product Structure Config</h3>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-lg"><LucideIcon name="x" size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 bg-[#F2F4F6] custom-scrollbar">
                    
                    {/* Basic Info */}
                    <div className="bg-white p-6 rounded-2xl border border-[#E6E1DB] shadow-sm mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">SFG Code</label>
                                <input type="text" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} className="w-full border border-[#B2CADE] bg-[#F2F4F6] rounded-xl p-3 text-[12px] font-mono font-bold focus:border-[#C22D2E] focus:bg-white transition-all outline-none" disabled={!!sfgData} placeholder="E.g. SFG-001" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">SFG Name</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-[#B2CADE] bg-[#F2F4F6] rounded-xl p-3 text-[12px] font-bold text-[#2E395F] focus:border-[#C22D2E] focus:bg-white transition-all outline-none" placeholder="Enter product name..." />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Batter Config */}
                        <div className="bg-white p-6 rounded-2xl border border-[#E6E1DB] shadow-sm flex flex-col h-[400px]">
                            <h4 className="text-[12px] font-black text-[#2E395F] border-b border-[#E6E1DB] pb-3 mb-5 uppercase tracking-widest flex justify-between items-center">
                                <span>Batter Composition</span>
                                <span className={`text-[10px] px-2 py-1 rounded-md font-mono ${isRatioValid ? 'bg-[#537E72]/10 text-[#537E72]' : 'bg-[#C22D2E]/10 text-[#C22D2E] animate-pulse'}`}>Total: {totalRatio}%</span>
                            </h4>
                            <div className="flex gap-2 mb-4">
                                <select value={selectedBatterId} onChange={e => setSelectedBatterId(e.target.value)} className="flex-1 border border-[#B2CADE] rounded-xl p-2.5 text-[12px] bg-[#F2F4F6] focus:bg-white outline-none font-bold text-[#55738D]">
                                    <option value="">-- Select Batter --</option>
                                    {batters.map((b: any) => <option key={b.id} value={b.id}>{b.name} ({b.id})</option>)}
                                </select>
                                <button onClick={handleAddBatter} className="bg-[#55738D] hover:bg-[#2E395F] text-white px-4 py-2.5 rounded-xl transition-colors shadow-sm shrink-0"><LucideIcon name="plus" size={16}/></button>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                                {formData.batterConfig.map((b: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center p-3 border border-[#E6E1DB] rounded-xl bg-[#F2F4F6]/50 text-[12px]">
                                        <div className="flex-1 font-bold text-[#2E395F]">
                                            <span className="text-[#C22D2E] font-mono mr-2">{b.id}</span>
                                            {batters.find((x: any) => x.id === b.id)?.name || b.id}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="number" value={b.ratio} onChange={e => {const newC = [...formData.batterConfig]; newC[idx].ratio = parseFloat(e.target.value)||0; setFormData({...formData, batterConfig: newC})}} className="w-16 text-right border border-[#B2CADE] rounded-lg p-1.5 font-black text-[#55738D] outline-none focus:border-[#C22D2E] font-mono" />
                                            <span className="text-[#737597] font-bold font-mono">%</span>
                                            <button onClick={() => setFormData({...formData, batterConfig: formData.batterConfig.filter((x: any)=>x.id!==b.id)})} className="text-red-400 hover:text-red-600 bg-white p-1.5 rounded-md border border-white hover:border-red-200 transition-all"><LucideIcon name="trash-2" size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                                {formData.batterConfig.length === 0 && <div className="text-center text-[#737597] text-[10px] uppercase tracking-widest font-bold pt-10 opacity-50">No batters configured</div>}
                            </div>
                        </div>

                        {/* FG Mapping */}
                        <div className="bg-white p-6 rounded-2xl border border-[#E6E1DB] shadow-sm flex flex-col h-[400px]">
                            <h4 className="text-[12px] font-black text-[#2E395F] border-b border-[#E6E1DB] pb-3 mb-5 uppercase tracking-widest">Mapped SKUs (FGs)</h4>
                            <div className="flex gap-2 mb-4">
                                <input type="text" list="fgList" value={selectedFgSku} onChange={e => setSelectedFgSku(e.target.value)} className="w-full border border-[#B2CADE] rounded-xl p-2.5 text-[12px] bg-[#F2F4F6] focus:bg-white outline-none font-bold text-[#55738D]" placeholder="Search & Select FG SKU..." />
                                <datalist id="fgList">{fgDatabase.map((fg: any) => <option key={fg.sku} value={fg.sku}>{fg.name}</option>)}</datalist>
                                <button onClick={handleAddFgFromDb} className="bg-[#C22D2E] hover:bg-[#9E2C21] text-white px-4 py-2.5 rounded-xl transition-colors shadow-sm shrink-0"><LucideIcon name="plus" size={16}/></button>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                                {formData.fgs.map((fg: any, idx: number) => (
                                    <div key={idx} className="p-3 border border-[#E6E1DB] rounded-xl bg-[#F2F4F6]/50 text-[12px] relative group flex flex-col gap-1">
                                        <div className="flex justify-between items-start">
                                            <span className="font-black font-mono text-[#55738D]">{fg.sku}</span>
                                            <button onClick={() => setFormData({...formData, fgs: formData.fgs.filter((_: any, i: number) => i !== idx)})} className="text-gray-400 hover:text-red-500 bg-white p-1 rounded-md transition-colors"><LucideIcon name="trash-2" size={14}/></button>
                                        </div>
                                        <div className="text-[#2E395F] font-bold truncate">{fg.name}</div>
                                    </div>
                                ))}
                                {formData.fgs.length === 0 && <div className="text-center text-[#737597] text-[10px] uppercase tracking-widest font-bold pt-10 opacity-50">No Finished Goods Mapped</div>}
                            </div>
                        </div>
                    </div>

                </div>
                <div className="p-5 bg-white border-t border-[#E6E1DB] flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="px-6 py-2.5 text-[#737597] hover:text-[#2E395F] font-bold text-[12px] uppercase tracking-widest transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-8 py-2.5 bg-[#C22D2E] hover:bg-[#9E2C21] text-white font-black text-[12px] uppercase tracking-widest rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"><LucideIcon name="save" size={14}/> Save Config</button>
                </div>
            </StandardModalWrapper>
        </div>
    );
}
