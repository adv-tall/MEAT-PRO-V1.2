import React, { useState, useEffect } from 'react';
import { BaseProductionView } from './components/BaseProductionView';
import { MixOverview } from './components/MixOverview';
import { SFGWaitingView } from './components/SFGWaitingView';
import { GuideTrigger } from '../../components/shared/SharedUI';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';
import { MOCK_BATCHES } from './constants';
import { Loader2, Activity, Layers, PackageOpen, LayoutDashboard } from 'lucide-react';

export default function MixingPlan() {
    const [activeTab, setActiveTab] = useState('base_production');
    const [activeBatches, setActiveBatches] = useState<any[]>([]);
    const [productMatrix, setProductMatrix] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showGuide, setShowGuide] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setTimeout(() => {
                setActiveBatches(MOCK_BATCHES);
                setProductMatrix([]);
                setLoading(false);
            }, 600); // Simulate API load
        };
        load();
    }, []);

    if(loading) return (
        <div className="flex h-screen w-full items-center justify-center bg-transparent" style={{ background: `linear-gradient(135deg, #F2F4F6 0%, #E6E1DB 100%)` }}>
            <div className="flex flex-col items-center gap-4">
                <Loader2 size={48} className="animate-spin text-[#C22D2E]" />
                <span className="text-[#2E395F] font-black uppercase tracking-widest text-sm animate-pulse">Loading Mixing Board...</span>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen w-full px-8 pt-8 pb-10 text-[#2E395F] overflow-x-hidden relative font-sans" style={{ background: `linear-gradient(135deg, #F2F4F6 0%, #E6E1DB 100%)` }}>
            
            <GuideTrigger onClick={() => setShowGuide(true)} />
            <UserGuidePanel isOpen={showGuide} onClose={() => setShowGuide(false)} title="MIXING GUIDE" iconName="book-open">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6 text-[#737597] leading-relaxed text-[12px]">
                    <section>
                        <h4 className="text-sm font-black text-[#2E395F] mb-3 uppercase flex items-center gap-2 border-b border-[#E6E1DB] pb-2 font-mono">
                            <Layers size={16} className="text-[#55738D]"/> 1. Batter &rarr; SFG
                        </h4>
                        <ul className="list-disc list-outside ml-4 space-y-2">
                            <li><strong>การปล่อยงาน:</strong> เลือกระบุจำนวน Set ของสูตรส่วนผสม (Batter) ระบบจะแตกออกเป็น Batches ย่อยอัตโนมัติ</li>
                            <li><strong>การติดตาม:</strong> ดูสถานะแต่ละ Batch ในทุกๆ ขั้นตอนการผลิต ตั้งแต่ Mixing ถึง Cutting</li>
                        </ul>
                    </section>
                    <section>
                        <h4 className="text-sm font-black text-[#2E395F] mb-3 uppercase flex items-center gap-2 border-b border-[#E6E1DB] pb-2 font-mono">
                            <PackageOpen size={16} className="text-[#55738D]"/> 2. SFG Waiting
                        </h4>
                        <p className="mb-2">ตารางแสดงรายการสินค้าที่ผ่านกระบวนการทำความเย็น/ปลอกเปลือก/ตัด แล้ว และรอนำส่งเข้าสู่กระบวนการแพ็ค</p>
                    </section>
                </div>
            </UserGuidePanel>

            {/* Header Bar */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 shrink-0 animate-fadeIn">
                <div className="flex items-center gap-4 shrink-0">
                    <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm border border-white/60 rounded-xl text-[#2E395F]">
                        <Activity size={24} strokeWidth={2} />
                    </div>
                    <div className="flex flex-col justify-center leading-none">
                        <h1 className="text-2xl font-black tracking-tight uppercase flex gap-2">
                            <span className="text-[#2E395F]">MIXING</span>
                            <span className="text-[#C22D2E]">BOARD</span>
                        </h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-1.5 text-[#55738D]">Interactive Production Floor Board</p>
                    </div>
                </div>
                
                <div className="bg-white/40 p-1.5 rounded-lg inline-flex items-center shadow-inner gap-1 border border-white/40 backdrop-blur-sm overflow-x-auto max-w-full no-scrollbar">
                    <button onClick={() => setActiveTab('base_production')} className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'base_production' ? 'bg-[#2E395F] text-white shadow-lg scale-105' : 'text-[#737597] hover:text-[#2E395F] hover:bg-white/80'}`}>
                        <Layers size={14} /> Batter &rarr; SFG
                    </button>
                    <button onClick={() => setActiveTab('sfg_waiting')} className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'sfg_waiting' ? 'bg-[#2E395F] text-white shadow-lg scale-105' : 'text-[#737597] hover:text-[#2E395F] hover:bg-white/80'}`}>
                        <PackageOpen size={14} /> SFG Waiting
                    </button>
                    <button onClick={() => setActiveTab('overview')} className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'overview' ? 'bg-[#2E395F] text-white shadow-lg scale-105' : 'text-[#737597] hover:text-[#2E395F] hover:bg-white/80'}`}>
                        <LayoutDashboard size={14} /> Overview
                    </button>
                </div>
            </header>

            <main className="flex-1 w-full flex flex-col relative z-10 custom-scrollbar animate-fadeIn min-h-0">
                {activeTab === 'overview' && <MixOverview />}
                {activeTab === 'base_production' && <BaseProductionView activeBatches={activeBatches} setActiveBatches={setActiveBatches} productMatrix={productMatrix} />}
                {activeTab === 'sfg_waiting' && <SFGWaitingView />}
            </main>
        </div>
    );
}
