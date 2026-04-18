import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as Icons from 'lucide-react';
import { KPICard } from '../../components/shared/DashboardKpiCard';
import { GuideTrigger } from '../../components/shared/SharedUI';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';
import { DraggableModal } from '../../components/shared/DraggableModal';

// --- Global Styles (Synced with Production Tracking Theme) ---
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap');

  :root {
    --font-mixed: 'JetBrains Mono', 'Noto Sans Thai', sans-serif;
  }

  * { 
    font-family: var(--font-mixed) !important; 
    box-sizing: border-box;
  }

  html, body { 
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }

  .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(46, 57, 95, 0.1); border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(194, 45, 46, 0.5); }
  
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }

  @keyframes pulse-red {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; background-color: #ef4444; }
  }
  .animate-alarm {
    animation: pulse-red 1.5s infinite;
  }
`;

// --- Mocking External Logic & Dependencies ---
const Swal = typeof window !== 'undefined' ? ((window as any).Swal || null) : null;

// --- CONSTANTS ---
const THEME = { 
    primary: '#C22D2E', 
    secondary: '#BB8588', 
    accent: '#DCBC1B', 
    success: '#537E72', 
    info: '#55738D',
    navy: '#2E395F' 
};

const SHIFTS = [
    { id: 'Morning', icon: 'sun', activeColor: 'bg-[#4A90E2] text-white shadow-md border-[#4A90E2]' },
    { id: 'Afternoon', icon: 'sunset', activeColor: 'bg-[#C22D2E] text-white shadow-md border-[#C22D2E]' },
    { id: 'Night', icon: 'moon', activeColor: 'bg-[#2E395F] text-white shadow-md border-[#2E395F]' },
    { id: 'All Day', icon: 'layers', activeColor: 'bg-[#55738D] text-white shadow-md border-[#55738D]' }
];

const FG_DATABASE: any[] = [
    { sku: 'FG-AFM-001', name: 'ไส้กรอกแดงจัมโบ้ AFM 1kg', weight: 1.0 },
    { sku: 'FG-AFM-002', name: 'ลูกชิ้นปลา AFM 500g', weight: 0.5 },
    { sku: 'FG-AFM-003', name: 'โบโลน่าไก่พริก AFM 1kg', weight: 1.0 },
    { sku: 'FG-1001', name: 'ไส้กรอกไก่จัมโบ้ ARO 1kg', weight: 1.0 },
    { sku: 'FG-1002', name: 'ไส้กรอกคอกเทล CP 500g', weight: 0.5 },
];

// Extend DB
for(let i=10; i<60; i++) {
    const brands = ['ARO', 'CP', 'BKP', 'SAVE', 'AFM', 'Generic'];
    FG_DATABASE.push({ sku: `FG-GEN-${i}`, name: `${brands[i % brands.length]} สินค้าทดสอบรายการที่ ${i}`, weight: (i % 2 === 0 ? 1.0 : 0.5) });
}

// --- HELPER COMPONENTS ---

const kebabToPascal = (str: string) => str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
const LucideIcon = ({ name, size = 16, className = "", color, style }: any) => {
    if (!name) return null;
    const pascalName = kebabToPascal(name);
    const IconComponent = (Icons as any)[pascalName] || (Icons as any)[`${pascalName}Icon`] || Icons.CircleHelp;
    if (!IconComponent) return null;
    return <IconComponent size={size} className={className} style={{...style, color: color}} strokeWidth={2.5} />;
};

// --- MASSIVE ORDER GENERATOR ---
const generateMockOrders = () => {
    const orders = [];
    let idCounter = 1;
    const todayStr = new Date().toISOString().split('T')[0].replace(/-/g, '').slice(2);
    const generateId = () => `${todayStr}-${String(idCounter++).padStart(3, '0')}`;

    orders.push({ id: generateId(), sku: 'FG-AFM-001', name: 'ไส้กรอกแดงจัมโบ้ AFM 1kg', qty: 30000, fgKg: 30000, sfgKg: 30000, batterKg: 33000, deadline: '12:00', status: 'IN PROGRESS', isReplacement: false, shift: 'Morning', currentStep: 'Packing' });
    orders.push({ id: generateId(), sku: 'FG-AFM-002', name: 'ลูกชิ้นปลา AFM 500g', qty: 40000, fgKg: 20000, sfgKg: 20000, batterKg: 22000, deadline: '16:00', status: 'PLANNED', isReplacement: false, shift: 'Afternoon', currentStep: 'Mixing' });

    const shifts = ['Morning', 'Afternoon', 'Night'];
    const statuses = ['DRAFT', 'APPROVED', 'PLANNED', 'IN PROGRESS', 'COMPLETED'];
    for (let i = 0; i < 110; i++) {
        const fg = FG_DATABASE[Math.floor(Math.random() * FG_DATABASE.length)];
        const targetKg = Math.floor(Math.random() * 2500) + 500;
        const qty = Math.ceil(targetKg / fg.weight);
        const shift = shifts[Math.floor(Math.random() * shifts.length)];
        let deadline = shift === 'Morning' ? '12:00' : (shift === 'Afternoon' ? '16:00' : '23:59');
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        orders.push({
            id: generateId(), sku: fg.sku, name: fg.name, qty, fgKg: qty * fg.weight, sfgKg: qty * fg.weight, batterKg: Number((qty * fg.weight * 1.1).toFixed(2)),
            deadline, status, isReplacement: Math.random() > 0.9, shift, currentStep: status === 'PLANNED' ? 'Queue' : (status === 'IN PROGRESS' ? 'Mixing' : 'Entry')
        });
    }
    return orders;
};

const MOCK_ORDERS = generateMockOrders();

// --- MAIN APPLICATION COMPONENT ---
export default function ProductionPlanning() {
    const [activeMainTab, setActiveMainTab] = useState('Entry');
    const [activeShift, setActiveShift] = useState('All Day');
    const [orders, setOrders] = useState(MOCK_ORDERS);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showGuide, setShowGuide] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [newItem, setNewItem] = useState({ date: new Date().toISOString().split('T')[0], time: '12:00', jobType: 'Normal', sku: FG_DATABASE[0].sku, quantity: '' });

    useEffect(() => {
        setTimeout(() => setLoading(false), 600);
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const totalSummary = useMemo(() => {
        return orders.reduce((acc, curr) => ({ fg: acc.fg + curr.fgKg, sfg: acc.sfg + curr.sfgKg, batter: acc.batter + curr.batterKg }), { fg: 0, sfg: 0, batter: 0 });
    }, [orders]);

    const filteredOrders = useMemo(() => {
        let filtered = orders;
        if (activeShift !== 'All Day') filtered = filtered.filter(o => o.shift === activeShift);
        if (activeMainTab === 'Entry') filtered = filtered.filter(o => ['DRAFT', 'APPROVED', 'PLANNED'].includes(o.status) && o.currentStep === 'Entry');
        else filtered = filtered.filter(o => o.currentStep === activeMainTab);
        return filtered;
    }, [orders, activeShift, activeMainTab]);

    const handleAddOrder = () => {
        if (!newItem.sku || !newItem.quantity) return;
        const fg = FG_DATABASE.find(f => f.sku === newItem.sku);
        const qtyNum = Number(newItem.quantity);
        const fgKg = qtyNum * (fg?.weight || 1);
        const shift = newItem.time === '12:00' ? 'Morning' : (newItem.time === '16:00' ? 'Afternoon' : 'Night');

        const newOrder = {
            id: `260416-N${String(Math.floor(Math.random()*1000)).padStart(3, '0')}`,
            sku: newItem.sku, name: fg?.name || 'Unknown', qty: qtyNum, fgKg, sfgKg: fgKg, batterKg: Number((fgKg * 1.1).toFixed(2)),
            deadline: newItem.time, status: 'DRAFT', isReplacement: newItem.jobType === 'Replacement',
            shift, currentStep: 'Entry'
        };
        setOrders([newOrder, ...orders]);
        setNewItem({ ...newItem, quantity: '' });
        setIsAddModalOpen(false);
        if (Swal) Swal.fire({ icon: 'success', title: 'Order Added', toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
    };

    const handleDelete = (id: string) => {
        if (Swal) {
            Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#C22D2E', confirmButtonText: 'Yes, delete it!' })
            .then((result: any) => { if (result.isConfirmed) setOrders(orders.filter(p => p.id !== id)); });
        }
    };

    const getAlarmStatus = (deadline: string, status: string) => {
        if (status === 'COMPLETED') return { color: 'text-[#537E72] border-[#537E72]/40 bg-[#537E72]/10', label: 'COMPLETED', blink: false };
        const [dh, dm] = (deadline || '23:59').split(':').map(Number);
        const deadlineDate = new Date(); deadlineDate.setHours(dh, dm, 0, 0);
        if (currentTime > deadlineDate) return { color: 'text-white border-red-600 bg-[#C22D2E] shadow-sm animate-alarm', label: 'DELAYED', blink: true };
        const diffMs = deadlineDate.getTime() - currentTime.getTime();
        if (diffMs <= 2 * 60 * 60 * 1000) return { color: 'text-orange-700 border-orange-400 bg-orange-50', label: 'URGENT', blink: false };
        return { color: 'text-[#55738D] border-[#55738D]/30 bg-[#F2F4F6]', label: 'ON PLAN', blink: false };
    };

    if (loading) return (
        <div className="flex h-screen w-full items-center justify-center bg-transparent" style={{ background: `linear-gradient(135deg, #F2F4F6 0%, #E6E1DB 100%)` }}>
            <div className="flex flex-col items-center gap-4">
                <Icons.Loader2 size={48} className="animate-spin text-[#C22D2E]" />
                <span className="text-[#2E395F] font-black uppercase tracking-widest text-[12px] animate-pulse">Initializing Production Engine...</span>
            </div>
        </div>
    );

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: globalStyles}} />
            <div className="flex flex-col h-full w-full text-[#2E395F] overflow-x-hidden relative font-sans px-8 pt-8 pb-10" style={{ background: `linear-gradient(135deg, #F2F4F6 0%, #E6E1DB 100%)` }}>
                
                <GuideTrigger onClick={() => setShowGuide(true)} />
                <UserGuidePanel isOpen={showGuide} onClose={() => setShowGuide(false)} title="PRODUCTION PLAN GUIDE" iconName="book-open">
                    <section>
                        <h4 className="text-sm font-black text-[#2E395F] mb-3 uppercase flex items-center gap-2 border-b border-[#E6E1DB] pb-2 font-mono"><Icons.ClipboardCheck size={16} className="text-[#55738D]"/> 1. อธิบายภาพรวม</h4>
                        <p>จัดการออเดอร์ผลิตรายวัน ตรวจสอบสถานะสุขภาพของแผน (Plan Health) และจัดตารางลงเครื่องจักรจริง</p>
                    </section>
                </UserGuidePanel>

                {/* Header Bar Synced with Production Tracking */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0 animate-fadeIn mb-0">
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm border border-white/60 rounded-xl text-[#2E395F]">
                            <Icons.Calendar size={24} strokeWidth={2} />
                        </div>
                        <div className="flex flex-col justify-center leading-none">
                            <h1 className="text-2xl font-black tracking-tight uppercase flex gap-2">
                                <span className="text-[#2E395F]">PLAN BY</span>
                                <span className="text-[#C22D2E]">PRODUCTION</span>
                            </h1>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-1.5 text-[#55738D]">Managing Active Production Orders & Execution</p>
                        </div>
                    </div>
                    
                    <div className="bg-white/40 p-1.5 rounded-lg inline-flex items-center shadow-inner gap-1 border border-white/40 backdrop-blur-sm overflow-x-auto max-w-full no-scrollbar">
                        {['Entry', 'Queue', 'Mixing', 'Packing'].map(tab => (
                            <button key={tab} onClick={() => setActiveMainTab(tab)} className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeMainTab === tab ? 'bg-[#2E395F] text-white shadow-lg scale-105' : 'text-[#737597] hover:text-[#2E395F] hover:bg-white/80'}`}>
                                {tab === 'Entry' && <Icons.Edit3 size={14} />}
                                {tab === 'Queue' && <Icons.List size={14} />}
                                {tab === 'Mixing' && <Icons.ChefHat size={14} />}
                                {tab === 'Packing' && <Icons.Package size={14} />}
                                {tab}
                            </button>
                        ))}
                    </div>
                </header>

                <main className="flex-1 w-full flex flex-col gap-6 relative z-10 custom-scrollbar animate-fadeIn min-h-0 mt-4">
                    
                    {/* KPI Cards Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
                        <KPICard title="Total FG Required" val={totalSummary.fg} unit="Kg" color="#2E395F" icon="package-check" desc="Output" />
                        <KPICard title="Flagship AFM" val={50000} unit="Kg" color="#C22D2E" icon="award" desc="Target 50T" />
                        <KPICard title="SFG Buffer" val={totalSummary.sfg} unit="Kg" color="#DCBC1B" icon="layers" desc="WIP" />
                        <KPICard title="Daily Batter" val={Math.ceil(totalSummary.batter)} unit="Kg" color="#537E72" icon="chef-hat" desc="Mixing" />
                    </div>

                    {/* Main Content Board (Rounded-none) */}
                    <div className="flex-1 flex flex-col min-w-0 bg-white/80 backdrop-blur-md rounded-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 overflow-hidden min-h-0">
                        
                        {/* TOOLBAR */}
                        <div className="px-6 py-4 border-b border-[#E6E1DB] flex flex-col md:flex-row justify-between items-center bg-[#F2F4F6]/50 shrink-0 gap-4">
                            <div className="flex items-center gap-1.5 bg-white border border-[#E6E1DB] p-1 rounded-xl shadow-sm">
                                {SHIFTS.map(shift => (
                                    <button key={shift.id} onClick={() => setActiveShift(shift.id)} className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${activeShift === shift.id ? shift.activeColor : 'bg-transparent text-[#737597] hover:bg-gray-50'}`}>
                                        <LucideIcon name={shift.icon} size={14} /> {shift.id}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="hidden lg:block text-[10px] font-black uppercase tracking-widest text-[#737597] bg-[#E6E1DB] px-3 py-1.5 rounded-md">{filteredOrders.length} Items Found</div>
                                <button onClick={() => setIsAddModalOpen(true)} className="bg-[#C22D2E] hover:bg-[#9E2C21] text-white px-6 py-2.5 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap h-10">
                                    <Icons.Plus size={18}/> Add New Order
                                </button>
                            </div>
                        </div>

                        {/* TABLE CONTENT */}
                        <div className="flex-1 overflow-hidden flex flex-col relative">
                            <div className="overflow-x-auto overflow-y-auto custom-scrollbar bg-transparent flex-1">
                                <table className="w-full text-left border-collapse min-w-[1100px]">
                                    <thead className="bg-[#C22D2E] border-b-[3px] border-[#2E395F] sticky top-0 z-20 text-white font-mono uppercase tracking-wider text-[11px] font-black shadow-md">
                                        <tr>
                                            <th className="py-4 px-6 pl-8 w-[14%] whitespace-nowrap">Plan ID</th>
                                            <th className="py-4 px-6 text-center w-[12%] whitespace-nowrap">Plan Health</th>
                                            <th className="py-4 px-6 w-auto whitespace-nowrap">Product SKU & Name</th>
                                            <th className="py-4 px-6 text-center w-[10%] whitespace-nowrap">Order (Pks)</th>
                                            <th className="py-4 px-6 text-center w-[10%] whitespace-nowrap">Weight (Kg)</th>
                                            <th className="py-4 px-6 text-center w-[10%] whitespace-nowrap">Deadline</th>
                                            <th className="py-4 px-6 text-center w-[10%] whitespace-nowrap">Status</th>
                                            <th className="py-4 px-6 pr-8 text-center w-[8%] whitespace-nowrap">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {filteredOrders.map(o => {
                                            const alarm = getAlarmStatus(o.deadline, o.status);
                                            return (
                                                <tr key={o.id} className="hover:bg-[#F2F4F6]/50 transition-colors group border-b border-[#E6E1DB]">
                                                    <td className="py-2 px-6 pl-8 align-middle">
                                                        <div className="flex flex-col items-start gap-1">
                                                            <span className="font-black text-[#2E395F] text-[12px] font-mono leading-tight">{o.id}</span>
                                                            {o.isReplacement && <span className="text-[8px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase font-black tracking-widest border border-red-200">Replacement</span>}
                                                        </div>
                                                    </td>
                                                    <td className="py-2 px-6 align-middle text-center">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm transition-all whitespace-nowrap ${alarm.color}`}>
                                                            {alarm.label}
                                                        </span>
                                                    </td>
                                                    <td className="py-2 px-6 align-middle">
                                                        <div className="font-bold text-[#2E395F] text-[12px] leading-tight truncate max-w-[280px]" title={o.name}>{o.name}</div>
                                                        <div className="text-[10px] text-[#737597] font-mono mt-0.5 font-bold uppercase tracking-widest">{o.sku}</div>
                                                    </td>
                                                    <td className="py-2 px-6 align-middle text-center">
                                                        <span className="font-mono font-black text-[#2E395F] text-[12px]">{o.qty.toLocaleString()}</span>
                                                    </td>
                                                    <td className="py-2 px-6 align-middle text-center">
                                                        <span className="font-mono font-black text-[#55738D] text-[12px]">{o.fgKg.toLocaleString()}</span>
                                                    </td>
                                                    <td className="py-2 px-6 align-middle text-center">
                                                        <span className="font-mono font-black text-[#C22D2E] text-[13px]">{o.deadline}</span>
                                                    </td>
                                                    <td className="py-2 px-6 align-middle text-center">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm whitespace-nowrap ${o.status === 'PLANNED' || o.status === 'IN PROGRESS' ? 'bg-[#537E72]/10 text-[#537E72] border-[#537E72]/30' : 'bg-[#F2F4F6] text-[#737597] border-[#E6E1DB]'}`}>
                                                            {o.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-2 px-6 pr-8 align-middle text-center">
                                                        <div className="flex justify-center gap-2">
                                                            <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#E6E1DB] text-[#737597] hover:border-[#2E395F] hover:text-[#2E395F] transition-all bg-white shadow-sm"><Icons.Edit3 size={14} /></button>
                                                            <button onClick={() => handleDelete(o.id)} className="w-8 h-8 rounded-lg flex items-center justify-center border border-red-100 text-[#C22D2E] hover:bg-[#C22D2E] hover:text-white transition-all bg-white shadow-sm"><Icons.Trash2 size={14} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {filteredOrders.length === 0 && (
                                            <tr>
                                                <td colSpan={8} className="py-20 text-center text-[#737597] font-bold uppercase tracking-widest text-[12px] opacity-50">
                                                    No orders found for this shift and step
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>

                {/* MODAL: ADD NEW ORDER (STDProcess Style) */}
                <DraggableModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Production Order" width="max-w-2xl">
                    {/* Modal Body (Light Gray) */}
                    <div className="p-8 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-8 bg-[#F8FAFC]">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2 md:col-span-1">
                                <label className="text-[10px] font-black text-[#55738D] uppercase mb-3 block tracking-widest">1. Delivery Deadline</label>
                                <div className="flex gap-2">
                                    {['12:00', '16:00', '24:00'].map(t => (
                                        <button key={t} onClick={()=>setNewItem({...newItem, time: t})} className={`flex-1 py-3.5 rounded-xl text-[12px] font-black transition-all font-mono border ${newItem.time === t ? 'bg-[#C22D2E] text-white border-[#C22D2E] shadow-md' : 'bg-white text-[#55738D] border-[#B2CADE] hover:bg-[#F2F4F6]'}`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="text-[10px] font-black text-[#55738D] uppercase mb-3 block tracking-widest">2. Job Type</label>
                                <div className="flex bg-[#E6E1DB]/50 p-1.5 rounded-xl border border-[#E6E1DB]">
                                    <button onClick={()=>setNewItem({...newItem, jobType: 'Normal'})} className={`flex-1 py-2.5 rounded-lg text-[11px] font-black uppercase transition-all ${newItem.jobType === 'Normal' ? 'bg-white text-[#2E395F] shadow-sm' : 'text-[#737597] hover:text-[#2E395F]'}`}>
                                        Normal
                                    </button>
                                    <button onClick={()=>setNewItem({...newItem, jobType: 'Replacement'})} className={`flex-1 py-2.5 rounded-lg text-[11px] font-black uppercase transition-all ${newItem.jobType === 'Replacement' ? 'bg-white text-[#C22D2E] shadow-sm' : 'text-[#737597] hover:text-[#C22D2E]'}`}>
                                        Replacement
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-[#737597] uppercase mb-3 block tracking-widest">3. Finished Goods (FG)</label>
                            <select value={newItem.sku} onChange={e => setNewItem({...newItem, sku: e.target.value})} className="w-full border border-[#B2CADE] bg-white rounded-xl p-3.5 text-[12px] font-bold text-[#2E395F] outline-none focus:border-[#C22D2E] shadow-sm uppercase cursor-pointer">
                                {FG_DATABASE.map(f => <option key={f.sku} value={f.sku}>{f.sku} : {f.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-[#737597] uppercase mb-3 block tracking-widest">4. Quantity (Packs)</label>
                            <div className="relative">
                                <input type="number" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: e.target.value})} className="w-full border border-[#B2CADE] bg-white rounded-xl p-4 text-2xl font-mono font-black text-[#2E395F] outline-none focus:border-[#C22D2E] shadow-sm pr-12" placeholder="0" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#737597] uppercase">PCK</span>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="p-6 bg-white border-t border-[#E6E1DB] flex justify-end gap-3 shrink-0 rounded-b-xl">
                        <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2.5 text-[#737597] hover:text-[#2E395F] font-bold text-[10px] uppercase tracking-widest transition-colors">Cancel</button>
                        <button onClick={handleAddOrder} className="px-8 py-3 bg-[#2E395F] hover:bg-[#141619] text-white rounded-xl font-black text-[13px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 active:scale-95">
                            <Icons.PlusCircle size={20} /> Add to Production Queue
                        </button>
                    </div>
                </DraggableModal>

            </div>
        </>
    );
}
