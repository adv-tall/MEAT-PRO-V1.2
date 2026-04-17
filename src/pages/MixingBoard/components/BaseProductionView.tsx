import React, { useState, useMemo, useEffect } from 'react';
import { BASE_PRODUCTS, PROCESS_FLOW, STEP_COLORS, THEME, SHEET_NAMES } from '../constants';
import { QrCodeModal } from './QrCodeModal';
import { ChevronDown, ClipboardList, Play, Square, ArrowRight, QrCode, Printer, Activity, Upload } from 'lucide-react';
import Swal from 'sweetalert2';
import { CsvUpload } from '../../../components/shared/CsvUpload';
import { DraggableModal } from '../../../components/shared/DraggableModal';

export const BaseProductionView = ({ activeBatches, setActiveBatches, productMatrix }: any) => {
    const [baseProduct, setBaseProduct] = useState(BASE_PRODUCTS[0].code);
    const [simSpeed, setSimSpeed] = useState(1);
    const [setsInput, setSetsInput] = useState(1);
    const [batchSequence, setBatchSequence] = useState(1);
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [selectedSetForQr, setSelectedSetForQr] = useState(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    // Get unique batters from product matrix
    const availableBatters = useMemo(() => {
        if (!productMatrix || productMatrix.length === 0) return BASE_PRODUCTS;
        const batters: any[] = [];
        productMatrix.forEach((m: any) => {
            if (m.batterConfig && m.batterConfig.length > 0) {
                m.batterConfig.forEach((b: any) => {
                    if (!batters.find(x => x.code === b.id)) {
                        batters.push({ code: b.id, name: b.id, type: 'Batter', stdBatchesPerSet: 6 });
                    }
                });
            }
        });
        return batters.length > 0 ? batters : BASE_PRODUCTS;
    }, [productMatrix]);

    useEffect(() => {
        if (availableBatters.length > 0 && !availableBatters.find(b => b.code === baseProduct)) {
            setBaseProduct(availableBatters[0].code);
        }
    }, [availableBatters, baseProduct]);

    // Simulated Timer Logic (Runs locally to avoid API spam)
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveBatches((current: any[]) => {
                return current.map(b => {
                    if (b.status === 'Processing' && b.timeLeft > 0) {
                        const newTime = Math.max(0, b.timeLeft - (1 * simSpeed));
                        if (newTime === 0) {
                            return { ...b, timeLeft: 0, status: 'Completed' };
                        }
                        return { ...b, timeLeft: newTime };
                    }
                    return b;
                });
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [simSpeed, setActiveBatches]);

    const handleImportCsv = (data: any[]) => {
        const newBatches = data.map((row, idx) => ({
            id: row['Batch ID'] || `BAT-IMP-${Date.now()}-${idx}`,
            jobId: row['Job ID'] || 'JOB-IMPORTED',
            name: row['Product Name'] || 'Unknown Product',
            step: row['Step']?.toLowerCase() || 'mixing',
            status: row['Status'] || 'Waiting',
            timeLeft: Number(row['Time Left']) || 900,
            startTime: row['Start Time'] || new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
            setNo: Number(row['Set No']) || Math.ceil(Math.random() * 100)
        }));
        
        setActiveBatches((prev: any[]) => [...newBatches, ...prev]);
        setIsImportModalOpen(false);
        Swal.fire('Imported', `${newBatches.length} batches imported successfully!`, 'success');
    };

    const handleStart = () => {
        if (setsInput <= 0) { Swal.fire('Error', 'Please enter quantity > 0', 'warning'); return; }
        const product = BASE_PRODUCTS.find(p => p.code === baseProduct) || availableBatters.find(p => p.code === baseProduct) || BASE_PRODUCTS[0];
        if (!product) return;
        const firstStep = PROCESS_FLOW[0];
        const nowStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
        
        const stdBatchesPerSet = product.stdBatchesPerSet || 6;
        const batchesToRelease = setsInput * stdBatchesPerSet;

        const newBatches = Array.from({ length: batchesToRelease }, (_, i) => ({
            id: `${product.code.split('-')[1] || 'BAT'}-${String(Math.floor(Math.random()*10000)).padStart(4,'0')}`,
            jobId: 'JOB-NEW',
            name: product.name,
            step: firstStep.id,
            status: 'Processing',
            timeLeft: firstStep.duration * 60,
            startTime: nowStr,
            setNo: Math.ceil((batchSequence + i) / stdBatchesPerSet) 
        }));
        
        const updatedBatches = [...activeBatches, ...newBatches];
        setActiveBatches(updatedBatches);
        setBatchSequence(prev => prev + batchesToRelease);
        
        Swal.fire({ 
            icon: 'success', 
            title: 'Production Started', 
            html: `Releasing <b>${setsInput} Sets</b><br/>(${batchesToRelease} Batches)`, 
            confirmButtonColor: THEME.primary, 
            timer: 1500,
            showConfirmButton: false
        });
    };

    const handleSetAction = (setNo: number, action: string) => {
        const updated = activeBatches.map((b: any) => {
            if (b.setNo === setNo) { 
                if (action === 'start' && b.status === 'Waiting') {
                     const stepObj = PROCESS_FLOW.find(s => s.id === b.step);
                     return { ...b, status: 'Processing', timeLeft: stepObj ? stepObj.duration * 60 : 0 };
                } else if (action === 'force' && b.status === 'Processing') {
                     return { ...b, timeLeft: 0, status: 'Completed' };
                } else if (action === 'next' && b.status === 'Completed') {
                     const currentStepIndex = PROCESS_FLOW.findIndex(s => s.id === b.step);
                     if (currentStepIndex < PROCESS_FLOW.length - 1) {
                         const nextStep = PROCESS_FLOW[currentStepIndex + 1];
                         return { ...b, step: nextStep.id, status: 'Waiting', timeLeft: nextStep.duration * 60 };
                     }
                }
            }
            return b;
        });
        setActiveBatches(updated);
    };

    const currentProductObj = availableBatters.find(p => p.code === baseProduct) || availableBatters[0] || BASE_PRODUCTS[0];
    const batchesToRelease = setsInput * (currentProductObj.stdBatchesPerSet || 6);

    const [selectedStep, setSelectedStep] = useState('mixing');

    const filteredBatches = useMemo(() => {
        return activeBatches.filter((b: any) => b.step === selectedStep);
    }, [activeBatches, selectedStep]);

    return (
        <div className="w-full font-sans animate-fadeIn flex flex-col gap-4 pb-6 min-h-0 h-full">
            <QrCodeModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} data={selectedSetForQr} />

            <DraggableModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                title="Bulk Import Batches"
                width="max-w-4xl"
            >
                <div className="p-6">
                    <CsvUpload 
                        onUpload={handleImportCsv}
                        requiredHeaders={["Batch ID", "Job ID", "Product Name", "Step", "Status", "Time Left", "Start Time", "Set No"]}
                        templateName="batches_template.csv"
                        instructions={[
                            "Upload a CSV file containing your batch execution details.",
                            "The file must include ALL exact headers listed above.",
                            "Use a comma as the delimiter.",
                            "Maximum file size is 10MB."
                        ]}
                    />
                </div>
            </DraggableModal>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-4 shrink-0">
                <div className="flex justify-between items-center mb-3 border-b border-[#E6E1DB] pb-2">
                    <h3 className="font-bold text-[#2E395F] text-sm flex items-center gap-2">
                        <Activity size={16} /> Production Planner
                    </h3>
                    <button 
                        onClick={() => setIsImportModalOpen(true)}
                        className="bg-white hover:bg-slate-50 text-[#2E395F] px-4 py-1.5 rounded-xl text-[10px] font-bold shadow-sm border border-[#E6E1DB] transition-all flex items-center gap-1.5 uppercase"
                    >
                        <Upload size={14} className="text-[#55738D]" /> Import CSV Batches
                    </button>
                </div>
                
                <div className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-12 lg:col-span-4 flex flex-col">
                        <label className="block text-[10px] font-black text-[#55738D] uppercase mb-1.5 tracking-widest pl-1">Batter Selection</label>
                        <div className="relative h-10 w-full">
                            <select value={baseProduct} onChange={e => setBaseProduct(e.target.value)} className="w-full h-full bg-[#F2F4F6] hover:bg-white border border-[#B2CADE]/50 rounded-xl pl-4 pr-10 text-[11px] font-bold text-[#2E395F] focus:outline-none focus:border-[#C22D2E] appearance-none shadow-sm transition-all cursor-pointer">
                                {availableBatters.map(p => <option key={p.code} value={p.code}>{p.code} : {p.name}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#55738D]">
                                <ChevronDown size={14}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-6 lg:col-span-2 flex flex-col">
                        <label className="block text-[10px] font-black text-[#55738D] uppercase mb-1.5 tracking-widest pl-1">Total Plan</label>
                        <div className="h-10 bg-[#F2F4F6]/50 border border-[#E6E1DB] rounded-xl flex flex-col justify-center px-4 relative overflow-hidden group hover:border-[#B2CADE] transition-all">
                            <div className="flex items-baseline gap-1.5"><span className="text-lg font-black text-[#2E395F] leading-none font-mono">120</span><span className="text-[9px] font-bold text-[#737597] uppercase">Batches</span></div>
                            <span className="text-[8px] text-[#737597] font-mono mt-0.5 font-bold">≈ 18,000 Kg</span>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-[0.05]">
                                <ClipboardList size={20}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-6 lg:col-span-2 flex flex-col">
                        <label className="block text-[10px] font-black text-[#55738D] uppercase mb-1.5 tracking-widest pl-1">Remaining</label>
                        <div className={`h-10 border rounded-xl flex flex-col justify-center px-4 relative overflow-hidden transition-all bg-[#55738D]/10 border-[#55738D]/20`}>
                            <div className="flex items-baseline gap-1.5"><span className={`text-lg font-black leading-none text-[#55738D] font-mono`}>75</span><span className={`text-[9px] font-bold uppercase text-[#55738D]`}>Left</span></div>
                            <div className="w-full bg-white/60 h-1 mt-1 rounded-full overflow-hidden"><div className={`h-full bg-[#55738D]`} style={{width: `40%`}}></div></div>
                        </div>
                    </div>
                    <div className="col-span-6 lg:col-span-2 flex flex-col">
                        <div className="flex justify-between items-center mb-1.5 pl-1 pr-1"><label className="text-[10px] font-black text-[#C22D2E] uppercase tracking-widest">Order Sets</label><span className="text-[8px] text-[#737597] font-black font-mono bg-[#E6E1DB] px-1.5 py-0.5 rounded-sm">1S={currentProductObj.stdBatchesPerSet || 6}B</span></div>
                        <div className="relative h-10"><input type="number" min="1" value={setsInput} onChange={e=>setSetsInput(Number(e.target.value))} className="w-full h-full bg-white border border-[#C22D2E]/40 hover:border-[#C22D2E] focus:border-[#C22D2E] rounded-xl text-center font-black text-lg text-[#C22D2E] focus:outline-none shadow-sm transition-colors font-mono" /></div>
                    </div>
                    <div className="col-span-6 lg:col-span-2 flex flex-col">
                        <button onClick={handleStart} disabled={batchesToRelease <= 0} className="w-full h-10 bg-[#C22D2E] hover:bg-[#9E2C21] text-white rounded-xl font-black shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none uppercase tracking-widest text-[10px]">
                            <Play size={12} fill="currentColor" /> START <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded ml-1">+{batchesToRelease}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Step Selector */}
            <div className="flex bg-white/80 backdrop-blur-md p-1.5 rounded-xl shadow-sm border border-white/60 gap-1.5 overflow-x-auto custom-scrollbar shrink-0">
                {PROCESS_FLOW.map((stage) => {
                    const count = activeBatches.filter((b: any) => b.step === stage.id).length;
                    const stepColor = STEP_COLORS[stage.id] || '#55738D';
                    const isSelected = selectedStep === stage.id;
                    
                    return (
                        <button
                            key={stage.id}
                            onClick={() => setSelectedStep(stage.id)}
                            className={`flex-1 min-w-[120px] py-1.5 px-2 rounded-lg border transition-all flex flex-col items-center gap-0.5`}
                            style={{ 
                                backgroundColor: isSelected ? stepColor : '#F2F4F6', 
                                borderColor: isSelected ? stepColor : '#E6E1DB',
                                color: isSelected ? 'white' : '#737597'
                            }}
                        >
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] font-black uppercase tracking-widest">{stage.label}</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border leading-none" style={{
                                    backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'white',
                                    borderColor: isSelected ? 'transparent' : '#E6E1DB',
                                    color: isSelected ? 'white' : stepColor
                                }}>
                                    {count}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Step Content */}
            <div className="flex-1 bg-white/80 backdrop-blur-md rounded-none border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden min-h-0">
                <div className="px-5 py-2.5 border-b border-[#E6E1DB] bg-[#F2F4F6]/50 flex justify-between items-center shrink-0">
                    <h3 className="font-black text-[#2E395F] flex items-center gap-2 uppercase tracking-widest text-[11px]">
                        {selectedStep} Process Board
                    </h3>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg bg-white border border-[#E6E1DB] text-[9px] font-black text-[#55738D] hover:text-[#2E395F] hover:border-[#B2CADE] transition-all flex items-center gap-1.5 shadow-sm uppercase tracking-widest">
                            <Printer size={12} /> Print
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-transparent custom-scrollbar">
                    {filteredBatches.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                            {filteredBatches.map((batch: any) => {
                                const stepObj = PROCESS_FLOW.find(s => s.id === batch.step);
                                const progress = batch.status === 'Processing' ? 100 - ((batch.timeLeft / ((stepObj?.duration || 30) * 60)) * 100) : (batch.status === 'Waiting' ? 0 : 100);
                                const sColor = STEP_COLORS[batch.step] || '#55738D';

                                return (
                                    <div key={batch.id} className="rounded-xl p-3 shadow-sm hover:shadow-md transition-all group relative overflow-hidden" style={{ backgroundColor: `${sColor}15`, borderColor: `${sColor}40`, borderWidth: '1px' }}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="min-w-0 pr-2">
                                                <div className="text-[9px] font-black font-mono uppercase tracking-widest mb-0.5 opacity-80" style={{ color: sColor }}>SET #{batch.setNo}</div>
                                                <div className="font-bold text-[#2E395F] text-[11px] truncate leading-tight">{batch.name}</div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="text-lg font-black font-mono leading-none" style={{ color: sColor }}>150</div>
                                                <div className="text-[8px] font-black uppercase tracking-widest opacity-60" style={{ color: sColor }}>KG</div>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 mb-2.5 bg-white/60 p-2 rounded-lg border border-white/50">
                                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                                <span className="text-[#737597]">Status</span>
                                                <span className={batch.status === 'Processing' ? 'text-[#537E72]' : batch.status === 'Completed' ? 'text-[#2E395F]' : 'text-[#B06821]'}>{batch.status}</span>
                                            </div>
                                            <div className="w-full bg-[#E6E1DB]/50 h-1 rounded-full overflow-hidden">
                                                <div className="h-full transition-all duration-1000 rounded-full" style={{ width: `${progress}%`, backgroundColor: batch.status === 'Processing' ? '#537E72' : batch.status === 'Completed' ? '#2E395F' : '#B06821' }}></div>
                                            </div>
                                            {batch.status === 'Processing' && (
                                                <div className="text-[9px] text-[#55738D] text-right font-mono font-bold leading-none pt-0.5">
                                                    {Math.floor(batch.timeLeft / 60)}:{(batch.timeLeft % 60).toString().padStart(2, '0')} Left
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-1.5">
                                            {batch.status === 'Waiting' ? (
                                                <button onClick={()=>handleSetAction(batch.setNo, 'start')} className="flex-1 py-1.5 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1 shadow-sm hover:brightness-90 active:scale-95" style={{ backgroundColor: sColor }}>
                                                    <Play size={10} fill="currentColor" /> Start
                                                </button>
                                            ) : batch.status === 'Processing' ? (
                                                <button onClick={()=>handleSetAction(batch.setNo, 'force')} className="flex-1 py-1.5 bg-white border border-[#E6E1DB] text-[#2E395F] rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1 hover:bg-red-50 hover:text-[#C22D2E] hover:border-red-200 shadow-sm active:scale-95">
                                                    <Square size={10} fill="currentColor" /> Finish
                                                </button>
                                            ) : (
                                                <button onClick={()=>handleSetAction(batch.setNo, 'next')} className="flex-1 py-1.5 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1 shadow-sm hover:brightness-110 active:scale-95" style={{ backgroundColor: '#2E395F' }}>
                                                    <ArrowRight size={10} /> Next
                                                </button>
                                            )}
                                            <button onClick={() => { setSelectedSetForQr({setNo: batch.setNo, items: [batch], productName: batch.name} as any); setQrModalOpen(true); }} className="w-8 h-7 flex items-center justify-center rounded-lg bg-white border border-[#E6E1DB] text-[#737597] hover:text-[#2E395F] hover:border-[#B2CADE] transition-all shadow-sm active:scale-95">
                                                <QrCode size={12} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-[#737597] opacity-50">
                            <p className="font-black uppercase tracking-widest text-sm">No batches in {selectedStep}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
