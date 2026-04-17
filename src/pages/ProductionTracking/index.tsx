import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { GuideTrigger, LucideIcon } from '../../components/shared/SharedUI';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';
import { DailyMonitor } from './components/DailyMonitor';
import { PackingQueueBoard } from './components/PackingQueueBoard';
import { CompletedBoard } from './components/CompletedBoard';

// --- Mock Data ---
const INITIAL_ORDERS = [
    { id: 'JO-2602-001', sku: 'SMC ไส้กรอกไก่ ARO 125g', client: 'ARO (Makro)', totalBatches: 200, 
      stages: { mixing: 150, forming: 120, steaming: 90, cooling: 85, cutting: 80, packing: 50, warehouse: 20 }, 
      stageUpdates: { mixing: '10:30', forming: '10:45', steaming: '11:10', cooling: '11:50', packing: '13:00' }, 
      status: 'In Progress' 
    },
    { id: 'JO-2602-002', sku: 'CP Frank Cocktail 500g', client: 'CP All', totalBatches: 100, 
      stages: { mixing: 100, forming: 100, steaming: 100, cooling: 100, cutting: 100, packing: 100, warehouse: 100 }, 
      stageUpdates: { warehouse: '11:15', packing: '10:00', cutting: '09:30' },
      status: 'Completed',
      lastUpdated: 'Today 11:15'
    },
    { id: 'JO-2602-003', sku: 'BKP Chili Bologna', client: 'Betagro', totalBatches: 50, 
      stages: { mixing: 50, forming: 45, steaming: 40, cooling: 0, cutting: 0, packing: 0, warehouse: 0 }, 
      stageUpdates: { steaming: '09:00', forming: '08:45', mixing: '08:00' },
      status: 'In Progress' 
    },
    { id: 'JO-2602-004', sku: 'Ham Slice 500g', client: 'Foodland', totalBatches: 30, 
      stages: { mixing: 30, forming: 30, steaming: 30, cooling: 30, cutting: 30, packing: 5, warehouse: 0 }, 
      stageUpdates: { cutting: '08:30', cooling: '08:00' },
      status: 'In Progress' 
    },
    { id: 'JO-2602-005', sku: 'Cheese Sausage 4 inch', client: 'Big C', totalBatches: 80, stages: { mixing: 80, forming: 60, steaming: 0, cooling: 0, cutting: 0, packing: 0, warehouse: 0 }, stageUpdates: { forming: '11:00' }, status: 'In Progress' },
    { id: 'JO-2602-006', sku: 'Spicy Sausage 150g', client: 'Tops', totalBatches: 120, stages: { mixing: 40, forming: 0, steaming: 0, cooling: 0, cutting: 0, packing: 0, warehouse: 0 }, stageUpdates: { mixing: '11:20' }, status: 'In Progress' },
    { id: 'JO-2602-007', sku: 'Chicken Breast Sliced', client: 'Makro', totalBatches: 200, stages: { mixing: 200, forming: 180, steaming: 150, cooling: 150, cutting: 150, packing: 10, warehouse: 0 }, stageUpdates: { steaming: '10:50' }, status: 'In Progress' },
    { id: 'JO-2602-008', sku: 'Pork Meatball 500g', client: 'Lotus', totalBatches: 60, stages: { mixing: 0, forming: 0, steaming: 0, cooling: 0, cutting: 0, packing: 0, warehouse: 0 }, stageUpdates: {}, status: 'Pending' },
    { id: 'JO-2602-009', sku: 'Vienna Sausage', client: 'Tops', totalBatches: 80, stages: { mixing: 80, forming: 80, steaming: 80, cooling: 80, cutting: 80, packing: 80, warehouse: 80 }, stageUpdates: { warehouse: '14:20' }, status: 'Completed', lastUpdated: 'Today 14:20' },
];

export default function ProductionTracking() {
    const [activeTab, setActiveTab] = useState('monitor');
    const [orders, setOrders] = useState<any[]>([]);
    const [showGuide, setShowGuide] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load Data (Mocking original fetchSheetData behavior)
    useEffect(() => {
        const load = () => {
            setLoading(true);
            setTimeout(() => {
                setOrders(INITIAL_ORDERS);
                setLoading(false);
            }, 600); // Simulate network delay
        };
        load();
    }, []);

    if(loading) return (
        <div className="flex h-screen w-full items-center justify-center bg-transparent" style={{ background: `linear-gradient(135deg, #F2F4F6 0%, #E6E1DB 100%)` }}>
            <div className="flex flex-col items-center gap-4">
                <LucideIcon name="loader-2" size={48} className="animate-spin text-[#C22D2E]" />
                <span className="text-[#2E395F] font-black uppercase tracking-widest text-[14px] animate-pulse">Loading Production Data...</span>
            </div>
        </div>
    );

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `
              .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
              .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
              .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(46, 57, 95, 0.1); border-radius: 10px; }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(194, 45, 46, 0.5); }
              @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
              .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
            `}} />
            <div className="flex flex-col min-h-screen w-full text-[#2E395F] overflow-x-hidden relative font-sans px-8 pt-8 pb-10" style={{ background: `linear-gradient(135deg, #F2F4F6 0%, #E6E1DB 100%)` }}>
                
                <GuideTrigger onClick={() => setShowGuide(true)} />
                <UserGuidePanel isOpen={showGuide} onClose={() => setShowGuide(false)} title="TRACKING GUIDE" iconName="book-open">
                    <section>
                        <h4 className="text-sm font-black text-[#2E395F] mb-3 uppercase flex items-center gap-2 border-b border-[#E6E1DB] pb-2 font-mono">
                            <LucideIcon name="layout-dashboard" size={16} className="text-[#55738D]"/> 1. Daily Monitor
                        </h4>
                        <ul className="list-disc list-outside ml-4 space-y-2">
                            <li><strong>แสดงสถานะแบบ Real-time:</strong> หน้าจอนี้ใช้สำหรับดูความคืบหน้าของงานที่กำลังผลิต (Active Jobs) โดยข้อมูลจะถูก Sync มาจากแผนการผลิต</li>
                            <li><strong>Completed Jobs:</strong> งานที่เสร็จสมบูรณ์แล้วจะถูกย้ายไปที่แท็บ "Completed"</li>
                        </ul>
                    </section>
                    <section className="mt-4">
                        <h4 className="text-sm font-black text-[#2E395F] mb-3 uppercase flex items-center gap-2 border-b border-[#E6E1DB] pb-2 font-mono">
                            <LucideIcon name="package-open" size={16} className="text-[#55738D]"/> 2. Packing Queue
                        </h4>
                        <p className="mb-2 text-[12px]">แสดงรายการสินค้าที่ผ่านขั้นตอนการตัด/ลอก (Cutting/Peeling) แล้ว และกำลังรอเข้าสู่กระบวนการแพ็ค</p>
                        <ul className="list-disc list-outside ml-4 space-y-2">
                            <li><strong>Ready to Pack:</strong> จำนวนที่พร้อมแพ็ค (Waiting)</li>
                            <li><strong>Progress:</strong> แสดงความคืบหน้าของการแพ็คเทียบกับเป้าหมาย</li>
                        </ul>
                    </section>
                </UserGuidePanel>

                {/* Header Bar */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0 animate-fadeIn mb-6">
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm border border-white/60 rounded-xl text-[#2E395F]">
                            <Icons.Activity size={24} strokeWidth={2} />
                        </div>
                        <div className="flex flex-col justify-center leading-none">
                            <h1 className="text-2xl font-black tracking-tight uppercase flex gap-2">
                                <span className="text-[#2E395F]">PRODUCTION</span>
                                <span className="text-[#C22D2E]">TRACKING</span>
                            </h1>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-1.5 text-[#55738D]">Real-Time Floor Monitoring & Execution</p>
                        </div>
                    </div>
                    
                    <div className="bg-white/40 p-1.5 rounded-lg inline-flex items-center shadow-inner gap-1 border border-white/40 backdrop-blur-sm overflow-x-auto max-w-full no-scrollbar">
                        <button onClick={() => setActiveTab('monitor')} className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'monitor' ? 'bg-[#2E395F] text-white shadow-lg scale-105' : 'text-[#737597] hover:text-[#2E395F] hover:bg-white/80'}`}>
                            <Icons.LayoutDashboard size={14} /> Daily Monitor
                        </button>
                        <button onClick={() => setActiveTab('packing_queue')} className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'packing_queue' ? 'bg-[#2E395F] text-white shadow-lg scale-105' : 'text-[#737597] hover:text-[#2E395F] hover:bg-white/80'}`}>
                            <Icons.PackageOpen size={14} /> Packing Queue
                        </button>
                        <button onClick={() => setActiveTab('completed')} className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'completed' ? 'bg-[#2E395F] text-white shadow-lg scale-105' : 'text-[#737597] hover:text-[#2E395F] hover:bg-white/80'}`}>
                            <Icons.Archive size={14} /> Completed
                        </button>
                    </div>
                </header>

                <main className="flex-1 w-full flex flex-col relative z-10 custom-scrollbar animate-fadeIn min-h-0">
                    {activeTab === 'monitor' && <DailyMonitor data={orders} />}
                    {activeTab === 'packing_queue' && <PackingQueueBoard data={orders} />}
                    {activeTab === 'completed' && <CompletedBoard data={orders} />}
                </main>
            </div>
        </>
    );
}
