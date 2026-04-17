import React, { useState, useEffect, useMemo } from 'react';
import * as Icons from 'lucide-react';
import Swal from 'sweetalert2';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { GuideTrigger, LucideIcon } from '../../components/shared/SharedUI';
import { UserGuidePanel } from '../../components/shared/UserGuidePanel';
import { KPICard } from '../../components/shared/DashboardKpiCard';
import { EquipmentModal } from './components/EquipmentModal';
import { BreakdownModal } from './components/BreakdownModal';
import { CsvUploadModal } from './components/CsvUploadModal';

const THEME = {
    primary: '#C22D2E',   // Deep Red
    secondary: '#BB8588', // Old Rose
    warning: '#DCBC1B',   // Vivid Gold
    success: '#537E72',   // Deep Sea Green
    info: '#55738D',      // Slate Blue
    navy: '#2E395F',      // Navy
    muted: '#737597'      // Muted Gray
};

const STEPS = ['Mixing', 'Forming', 'Cooking', 'Cooling', 'Peeling', 'Cutting', 'Packing'];

const INITIAL_EQUIPMENT = [
    { id: 'EQ-MIX-001', name: 'Bowl Cutter 200L', step: 'Mixing', qty: 2, note: 'เครื่องหลักไลน์ A' },
    { id: 'EQ-MIX-002', name: 'Vacuum Mixer 500L', step: 'Mixing', qty: 1, note: 'สำหรับผสม Batter' },
    { id: 'EQ-FRM-001', name: 'Frank-A-Matic Hi-Speed', step: 'Forming', qty: 2, note: 'ไส้กรอกยาว' },
    { id: 'EQ-FRM-002', name: 'Meatball Former', step: 'Forming', qty: 3, note: 'ลูกชิ้น' },
    { id: 'EQ-CK-001', name: 'SmokeHouse Gen3', step: 'Cooking', qty: 2, note: 'ตู้อบรมควัน' },
    { id: 'EQ-CL-001', name: 'Rapid Chill Tunnel', step: 'Cooling', qty: 1, note: 'ลดอุณหภูมิ' },
    { id: 'EQ-PK-001', name: 'Thermoformer Pack', step: 'Packing', qty: 2, note: 'แพ็คสูญญากาศ' },
    { id: 'EQ-PK-002', name: 'Flow Pack Wrapper', step: 'Packing', qty: 1, note: 'แพ็คซองตั้ง' },
];

const generateMockBreakdowns = () => [
    { id: 'BD-260401', date: '04/04/2026', machineId: 'EQ-MIX-002', machineName: 'Vacuum Mixer 500L', problem: 'Motor Overheating (Temp > 85c)', actionTaken: '', downtimeMinutes: 45, status: 'Open', reportedBy: 'Operator A' },
    { id: 'BD-260402', date: '03/04/2026', machineId: 'EQ-FRM-001', machineName: 'Twist Linker A', problem: 'Casing Jammed / Tearing', actionTaken: 'Replaced linking nozzle and recalibrated speed', downtimeMinutes: 20, status: 'Resolved', reportedBy: 'Tech Lead' },
    { id: 'BD-260403', date: '01/04/2026', machineId: 'EQ-CK-001', machineName: 'Smoke House 6T', problem: 'Steam Valve Leak', actionTaken: 'Tightened valve and replaced gasket seal', downtimeMinutes: 120, status: 'Resolved', reportedBy: 'Maintenance' },
    { id: 'BD-260329', date: '29/03/2026', machineId: 'EQ-PK-001', machineName: 'Thermoformer Pack', problem: 'Vacuum Pump Failure', actionTaken: 'Swapped backup pump unit', downtimeMinutes: 90, status: 'Resolved', reportedBy: 'Maintenance' },
    { id: 'BD-260328', date: '28/03/2026', machineId: 'EQ-MIX-001', machineName: 'Bowl Cutter 200L', problem: 'Blade sensor error', actionTaken: '', downtimeMinutes: 15, status: 'Open', reportedBy: 'Operator B' },
];

export default function EquipmentRegistry() {
    const [activeTab, setActiveTab] = useState('equipment');
    const [equipment, setEquipment] = useState<any[]>([]);
    const [breakdowns, setBreakdowns] = useState<any[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [showGuide, setShowGuide] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStep, setFilterStep] = useState('All');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    // Modal State
    const [eqModal, setEqModal] = useState<{isOpen: boolean, data: any}>({ isOpen: false, data: null });
    const [bdModal, setBdModal] = useState<{isOpen: boolean, data: any}>({ isOpen: false, data: null });
    const [csvModalOpen, setCsvModalOpen] = useState(false);

    useEffect(() => {
        const loadData = () => {
            setLoading(true);
            setTimeout(() => {
                setEquipment(INITIAL_EQUIPMENT);
                setBreakdowns(generateMockBreakdowns());
                setLoading(false);
            }, 600);
        };
        loadData();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
        setSearchTerm('');
        setFilterStep('All');
    }, [activeTab]);

    // Data Filtering
    const filteredEquipment = useMemo(() => {
        return equipment.filter(item => {
            const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchStep = filterStep === 'All' || item.step === filterStep;
            return matchSearch && matchStep;
        });
    }, [searchTerm, equipment, filterStep]);

    const filteredBreakdowns = useMemo(() => {
        return breakdowns.filter(item => {
            const matchSearch = item.machineName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                item.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                item.id.toLowerCase().includes(searchTerm.toLowerCase());
            return matchSearch;
        });
    }, [searchTerm, breakdowns]);

    const activeData = activeTab === 'equipment' ? filteredEquipment : filteredBreakdowns;
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedData = activeData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(activeData.length / itemsPerPage);

    // Handlers
    const handleSaveEquipment = (newItem: any) => {
        if (eqModal.data) {
            setEquipment(equipment.map(i => i.id === newItem.id ? newItem : i));
        } else {
            const newId = `EQ-${newItem.step.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-3)}`;
            setEquipment([{ ...newItem, id: newId }, ...equipment]);
        }
        Swal.fire({ icon: 'success', title: 'Saved Successfully', showConfirmButton: false, timer: 1000 });
    };

    const handleDeleteEquipment = (id: string) => {
        Swal.fire({ title: 'Are you sure?', text: `Delete machine ${id}?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#C22D2E', confirmButtonText: 'Yes, delete it!' }).then((result) => { 
            if (result.isConfirmed) { 
                setEquipment(equipment.filter(item => item.id !== id)); 
                Swal.fire({icon: 'success', title: 'Deleted!', text: 'Machine deleted.', timer: 1500, showConfirmButton: false}); 
            } 
        });
    };

    const handleSaveBreakdown = (newItem: any) => {
        const selectedMachine = equipment.find(e => e.id === newItem.machineId);
        const machineName = selectedMachine ? selectedMachine.name : newItem.machineId;

        const record = {
            id: bdModal.data ? bdModal.data.id : `BD-${Date.now().toString().slice(-6)}`,
            date: bdModal.data ? bdModal.data.date : new Date().toLocaleDateString('en-GB'),
            machineId: newItem.machineId,
            machineName,
            problem: newItem.problem,
            actionTaken: newItem.actionTaken,
            downtimeMinutes: newItem.downtimeMinutes,
            status: newItem.status,
            reportedBy: bdModal.data ? bdModal.data.reportedBy : 'Current User'
        };

        if (bdModal.data) {
            setBreakdowns(breakdowns.map(b => b.id === record.id ? record : b));
        } else {
            setBreakdowns([record, ...breakdowns]);
        }
        
        setBdModal({ isOpen: false, data: null });
        Swal.fire({ icon: 'success', title: 'Saved Successfully', showConfirmButton: false, timer: 1000 });
    };

    const handleDeleteBreakdown = (id: string) => {
        Swal.fire({ title: 'Are you sure?', text: `Delete record ${id}?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#C22D2E', confirmButtonText: 'Yes, delete it!' }).then((result) => { 
            if (result.isConfirmed) { 
                setBreakdowns(breakdowns.filter(item => item.id !== id)); 
                Swal.fire({icon: 'success', title: 'Deleted!', text: 'Record deleted.', timer: 1500, showConfirmButton: false}); 
            } 
        });
    };

    const handleCsvUpload = (newItems: any[]) => {
        const updated = [...equipment];
        newItems.forEach(ni => {
            const idx = updated.findIndex(u => u.id === ni.id);
            if (idx >= 0) updated[idx] = ni; else updated.unshift(ni);
        });
        setEquipment(updated);
    };

    if (loading) return (
        <div className="flex h-screen w-full items-center justify-center bg-transparent" style={{ background: `linear-gradient(135deg, #F2F4F6 0%, #E6E1DB 100%)` }}>
            <div className="flex flex-col items-center gap-4">
                <LucideIcon name="loader-2" size={48} className="animate-spin text-[#C22D2E]" />
                <span className="text-[#2E395F] font-black uppercase tracking-widest text-sm animate-pulse">Loading Equipment Data...</span>
            </div>
        </div>
    );

    // OEE Calculations
    const totalDowntime = breakdowns.reduce((sum, b) => sum + b.downtimeMinutes, 0);
    const openIssues = breakdowns.filter(b => b.status === 'Open').length;
    const resolvedIssues = breakdowns.filter(b => b.status === 'Resolved').length;
    const totalAvailableTime = equipment.length * 8 * 60; // Assuming 8 hours per machine
    const availability = totalAvailableTime > 0 ? ((totalAvailableTime - totalDowntime) / totalAvailableTime) * 100 : 100;

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
                <UserGuidePanel isOpen={showGuide} onClose={() => setShowGuide(false)} title="REGISTRY GUIDE" iconName="book-open">
                    <section>
                        <h4 className="text-sm font-black text-[#2E395F] mb-3 uppercase flex items-center gap-2 border-b border-[#E6E1DB] pb-2 font-mono">
                            <LucideIcon name="settings" size={16} className="text-[#55738D]"/> Machine Registry
                        </h4>
                        <ul className="list-disc list-outside ml-4 space-y-2">
                            <li><strong>Equipment Hub:</strong> จัดการข้อมูลเครื่องจักร ระบุจำนวนและจัดกลุ่มตามขั้นตอนการผลิต</li>
                        </ul>
                    </section>
                    <section className="mt-4">
                        <h4 className="text-sm font-black text-[#2E395F] mb-3 uppercase flex items-center gap-2 border-b border-[#E6E1DB] pb-2 font-mono">
                            <LucideIcon name="wrench" size={16} className="text-[#55738D]"/> Breakdown Log
                        </h4>
                        <ul className="list-disc list-outside ml-4 space-y-2">
                            <li><strong>Maintenance Tracking:</strong> ใช้สำหรับบันทึกประวัติการเสียและซ่อมบำรุงเครื่องจักร</li>
                            <li><strong>OEE Metrics & Dashboard:</strong> ระบบวิเคราะห์ประสิทธิภาพเครื่องจักรโดยรวม เพื่อหา Top Issues และวางแผน PM ล่วงหน้า</li>
                        </ul>
                    </section>
                </UserGuidePanel>
                
                <CsvUploadModal isOpen={csvModalOpen} onClose={() => setCsvModalOpen(false)} onUpload={handleCsvUpload} />
                <EquipmentModal isOpen={eqModal.isOpen} onClose={() => setEqModal({ isOpen: false, data: null })} data={eqModal.data} onSave={handleSaveEquipment} />
                <BreakdownModal isOpen={bdModal.isOpen} onClose={() => setBdModal({ isOpen: false, data: null })} data={bdModal.data} onSave={handleSaveBreakdown} equipment={equipment} />

                {/* Header Bar */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0 animate-fadeIn mb-6">
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm border border-white/60 rounded-xl text-[#2E395F]">
                            <Icons.Wrench size={24} strokeWidth={2} />
                        </div>
                        <div className="flex flex-col justify-center leading-none">
                            <h1 className="text-2xl font-black tracking-tight uppercase flex gap-2">
                                <span className="text-[#2E395F]">EQUIPMENT</span>
                                <span className="text-[#C22D2E]">REGISTRY</span>
                            </h1>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-1.5 text-[#55738D]">Machine & Facility Hub</p>
                        </div>
                    </div>
                    
                    <div className="bg-white/40 p-1.5 rounded-lg inline-flex items-center shadow-inner gap-1 border border-white/40 backdrop-blur-sm overflow-x-auto max-w-full no-scrollbar">
                        <button onClick={() => setActiveTab('equipment')} className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'equipment' ? 'bg-[#2E395F] text-white shadow-lg scale-105' : 'text-[#737597] hover:text-[#2E395F] hover:bg-white/80'}`}>
                            <Icons.Settings size={14} /> Machine List
                        </button>
                        <button onClick={() => setActiveTab('breakdowns')} className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'breakdowns' ? 'bg-[#2E395F] text-white shadow-lg scale-105' : 'text-[#737597] hover:text-[#2E395F] hover:bg-white/80'}`}>
                            <Icons.List size={14} /> Breakdown List
                        </button>
                        <button onClick={() => setActiveTab('oee')} className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'oee' ? 'bg-[#2E395F] text-white shadow-lg scale-105' : 'text-[#737597] hover:text-[#2E395F] hover:bg-white/80'}`}>
                            <Icons.Activity size={14} /> OEE Metrics
                        </button>
                        <button onClick={() => setActiveTab('dashboard')} className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-[#2E395F] text-white shadow-lg scale-105' : 'text-[#737597] hover:text-[#2E395F] hover:bg-white/80'}`}>
                            <Icons.PieChart size={14} /> Dashboard
                        </button>
                    </div>
                </header>

                <main className="flex-1 w-full flex flex-col gap-6 relative z-10 custom-scrollbar animate-fadeIn min-h-0">
                    
                    {/* KPI Row */}
                    {(activeTab === 'breakdowns' || activeTab === 'equipment') && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
                            {activeTab === 'equipment' ? (
                                <>
                                    <KPICard title="Total Machines" val={equipment.length} unit="Units" color={THEME.info} icon="settings" desc="Active machinery" />
                                    <KPICard title="Forming Machines" val={equipment.filter(e => e.step === 'Forming').length} color={THEME.warning} icon="component" desc="Core production" />
                                    <KPICard title="Cooking Ovens" val={equipment.filter(e => e.step === 'Cooking').length} color={THEME.primary} icon="thermometer" desc="Heating units" />
                                    <KPICard title="Packaging Lines" val={equipment.filter(e => e.step === 'Packing').length} color={THEME.success} icon="package" desc="End of line" />
                                </>
                            ) : (
                                <>
                                    <KPICard title="Total Downtime" val={totalDowntime} unit="Min" color={THEME.primary} icon="clock" desc="Across all machines" />
                                    <KPICard title="Open Issues" val={openIssues} color={THEME.warning} icon="alert-triangle" desc="Require attention" />
                                    <KPICard title="Resolved" val={resolvedIssues} color={THEME.success} icon="check-circle" desc="Fixed issues" />
                                    <KPICard title="Avg Availability" val={availability.toFixed(1)} unit="%" color={THEME.info} icon="activity" desc="Estimated OEE Availability" />
                                </>
                            )}
                        </div>
                    )}

                    {/* MAIN CONTENT AREA */}
                    {(activeTab === 'equipment' || activeTab === 'breakdowns') && (
                        <div className="bg-white/80 backdrop-blur-md rounded-none border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col flex-1 min-h-0">
                            
                            {/* TOOLBAR */}
                            <div className="px-6 py-4 border-b border-[#E6E1DB] flex flex-col md:flex-row justify-between items-center bg-[#F2F4F6]/50 shrink-0 gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-[12px] font-black text-[#2E395F] uppercase tracking-widest">
                                        <Icons.List size={16} className="text-[#C22D2E]"/>
                                        <span>{activeTab === 'equipment' ? 'Machine Registry' : 'Breakdown Records'}</span>
                                    </div>
                                    <span className="text-[#E6E1DB]">|</span>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-[#737597] bg-[#E6E1DB] px-2 py-1 rounded-sm">{activeData.length} Records</div>
                                </div>
                                <div className="flex gap-3 w-full md:w-auto items-center">
                                    {activeTab === 'equipment' && (
                                        <div className="relative group">
                                            <Icons.Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#55738D] group-hover:text-[#C22D2E] transition-colors" />
                                            <select value={filterStep} onChange={(e) => setFilterStep(e.target.value)} className="pl-9 pr-8 py-2 border border-[#B2CADE]/50 rounded-xl text-[12px] font-bold bg-white focus:border-[#C22D2E] outline-none cursor-pointer transition-all text-[#2E395F] shadow-sm appearance-none h-10">
                                                <option value="All">All Steps</option>
                                                {STEPS.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            <Icons.ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#55738D] pointer-events-none" />
                                        </div>
                                    )}
                                    <div className="relative flex-1 md:w-64">
                                        <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55738D]"/>
                                        <input type="text" placeholder={activeTab === 'equipment' ? "Search Machine..." : "Search Machine, Issue..."} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-[#B2CADE]/50 rounded-xl text-[12px] font-bold focus:outline-none focus:border-[#2E395F] bg-white shadow-sm text-[#2E395F] h-10" />
                                    </div>
                                    
                                    {activeTab === 'equipment' ? (
                                        <>
                                            <button onClick={() => setCsvModalOpen(true)} className="bg-white border border-[#E6E1DB] hover:border-[#B2CADE] text-[#55738D] px-4 py-2 rounded-xl font-bold text-[12px] uppercase tracking-widest flex items-center gap-2 shadow-sm transition-colors hidden md:flex h-10"><Icons.Upload size={14} /> Import</button>
                                            <button onClick={() => setEqModal({ isOpen: true, data: null })} className="bg-[#C22D2E] hover:bg-[#9E2C21] text-white px-5 py-2 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap shrink-0 h-10">
                                                <Icons.Plus size={14} /> New Machine
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={() => setBdModal({ isOpen: true, data: null })} className="bg-[#C22D2E] hover:bg-[#9E2C21] text-white px-5 py-2 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 whitespace-nowrap shrink-0 h-10">
                                            <Icons.AlertTriangle size={14} /> Report Issue
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* TABLE */}
                            <div className="flex-1 overflow-hidden flex flex-col">
                                <div className="overflow-y-auto flex-1 custom-scrollbar">
                                    <table className="w-full text-left min-w-[900px] border-collapse">
                                        <thead className="bg-[#C22D2E] border-b-[3px] border-[#2E395F] sticky top-0 z-10 text-white font-mono uppercase tracking-wider text-[12px] font-black">
                                            {activeTab === 'equipment' ? (
                                                <tr>
                                                    <th className="py-4 px-6 pl-8 w-[15%] whitespace-nowrap">ID</th>
                                                    <th className="py-4 px-6 w-auto whitespace-nowrap">Machine Name</th>
                                                    <th className="py-4 px-6 w-[15%] text-center whitespace-nowrap">Process Step</th>
                                                    <th className="py-4 px-6 w-[15%] text-center whitespace-nowrap">Quantity</th>
                                                    <th className="py-4 px-6 w-[20%] whitespace-nowrap">Note</th>
                                                    <th className="py-4 px-6 pr-8 text-right w-20 whitespace-nowrap">Action</th>
                                                </tr>
                                            ) : (
                                                <tr>
                                                    <th className="py-4 px-6 pl-8 w-[12%] whitespace-nowrap">Date</th>
                                                    <th className="py-4 px-6 w-[20%] whitespace-nowrap">Machine</th>
                                                    <th className="py-4 px-6 w-[25%] whitespace-nowrap">Problem</th>
                                                    <th className="py-4 px-6 w-[20%] whitespace-nowrap">Action Taken</th>
                                                    <th className="py-4 px-6 w-[10%] text-right whitespace-nowrap">Downtime</th>
                                                    <th className="py-4 px-6 w-[10%] text-center whitespace-nowrap">Status</th>
                                                    <th className="py-4 px-6 pr-8 text-right w-20 whitespace-nowrap">Action</th>
                                                </tr>
                                            )}
                                        </thead>
                                        <tbody className="bg-white">
                                            {paginatedData.map((item: any) => (
                                                <tr key={item.id} className="hover:bg-[#F2F4F6]/50 transition-colors border-b border-[#E6E1DB] group">
                                                    
                                                    {activeTab === 'equipment' ? (
                                                        <>
                                                            <td className="py-2 px-6 pl-8 align-middle">
                                                                <span className="font-bold text-[#C22D2E] text-[12px] font-mono leading-tight bg-[#C22D2E]/10 px-2 py-0.5 rounded-md border border-[#C22D2E]/20">{item.id}</span>
                                                            </td>
                                                            <td className="py-2 px-6 align-middle font-bold text-[#2E395F] text-[12px]">{item.name}</td>
                                                            <td className="py-2 px-6 align-middle text-center">
                                                                <span className="bg-[#F2F4F6] text-[#737597] px-3 py-1 rounded-full text-[11px] font-bold border border-[#E6E1DB] uppercase tracking-widest shadow-sm">{item.step}</span>
                                                            </td>
                                                            <td className="py-2 px-6 align-middle text-center">
                                                                <div className="font-black text-[#2E395F] text-[12px] font-mono bg-white px-3 py-1 rounded-md border border-[#E6E1DB] inline-block shadow-sm">{item.qty}</div>
                                                            </td>
                                                            <td className="py-2 px-6 align-middle">
                                                                <div className="text-[11px] text-[#55738D] font-normal truncate max-w-xs">{item.note || '-'}</div>
                                                            </td>
                                                            <td className="py-2 px-6 pr-8 align-middle">
                                                                <div className="flex justify-end gap-2">
                                                                    <button onClick={() => setEqModal({ isOpen: true, data: item })} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6E1DB] text-[#737597] hover:border-[#55738D] hover:text-[#2E395F] hover:bg-gray-50 transition-colors shadow-sm bg-white"><Icons.Pencil size={14} /></button>
                                                                    <button onClick={() => handleDeleteEquipment(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6E1DB] text-[#C22D2E] hover:border-[#C22D2E] hover:bg-red-50 transition-colors shadow-sm bg-white"><Icons.Trash2 size={14} /></button>
                                                                </div>
                                                            </td>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <td className="py-2 px-6 pl-8 align-middle">
                                                                <div className="flex flex-col items-start gap-1">
                                                                    <span className="font-bold text-[#2E395F] text-[12px] font-mono">{item.date}</span>
                                                                    <span className="text-[#737597] text-[10px] font-mono font-bold">{item.id}</span>
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-6 align-middle font-bold text-[#2E395F] text-[12px]">
                                                                {item.machineName}
                                                            </td>
                                                            <td className="py-2 px-6 align-middle">
                                                                <div className="text-[12px] text-[#C22D2E] font-bold truncate max-w-[200px]" title={item.problem}>{item.problem}</div>
                                                            </td>
                                                            <td className="py-2 px-6 align-middle">
                                                                <div className="text-[11px] text-[#55738D] font-normal truncate max-w-[200px]" title={item.actionTaken || 'Pending action'}>{item.actionTaken || <span className="italic text-[#B2CADE]">-</span>}</div>
                                                            </td>
                                                            <td className="py-2 px-6 align-middle text-right">
                                                                <div className="flex items-baseline justify-end gap-1 whitespace-nowrap">
                                                                    <span className="font-mono font-black text-[#C22D2E] text-[12px]">{item.downtimeMinutes}</span>
                                                                    <span className="text-[10px] text-[#737597] font-bold uppercase tracking-widest">Min</span>
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-6 align-middle text-center">
                                                                <span className={`px-3 py-1 rounded-full text-[10px] font-normal uppercase tracking-widest shadow-sm border whitespace-nowrap ${item.status === 'Resolved' ? 'bg-white text-[#537E72] border-[#537E72]/40' : 'bg-white text-[#B06821] border-[#DCBC1B]/40'}`}>{item.status}</span>
                                                            </td>
                                                            <td className="py-2 px-6 pr-8 align-middle">
                                                                <div className="flex justify-end gap-2">
                                                                    <button onClick={() => setBdModal({ isOpen: true, data: item })} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6E1DB] text-[#737597] hover:border-[#55738D] hover:text-[#2E395F] hover:bg-gray-50 transition-colors shadow-sm bg-white"><Icons.Pencil size={14} /></button>
                                                                    <button onClick={() => handleDeleteBreakdown(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E6E1DB] text-[#C22D2E] hover:border-[#C22D2E] hover:bg-red-50 transition-colors shadow-sm bg-white"><Icons.Trash2 size={14} /></button>
                                                                </div>
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))}
                                            {paginatedData.length === 0 && (
                                                <tr>
                                                    <td colSpan={7} className="py-12 text-center text-[#737597] font-bold uppercase tracking-widest text-[12px] opacity-50">
                                                        No Records Found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* Pagination (Synced) */}
                                <div className="p-4 bg-white/60 backdrop-blur-md border-t border-[#E6E1DB] flex justify-between items-center font-bold text-[#55738D] uppercase tracking-widest shrink-0 font-mono text-[10px]">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <span>SHOW:</span>
                                            <select 
                                                value={itemsPerPage} 
                                                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} 
                                                className="bg-white border border-[#B2CADE]/50 rounded-md px-2 py-1 outline-none focus:border-[#2E395F] text-[#2E395F] cursor-pointer"
                                            >
                                                {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                                            </select>
                                        </div>
                                        <div>TOTAL {activeData.length} ITEMS</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`p-1.5 border border-[#B2CADE]/40 bg-white rounded-lg transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#F2F4F6] text-[#2E395F] shadow-sm'}`}><LucideIcon name="chevron-left" size={16}/></button>
                                        <div className="bg-white border border-[#B2CADE]/30 px-5 py-1.5 rounded-lg shadow-sm text-[#2E395F] font-black min-w-[120px] text-center uppercase tracking-widest">PAGE {currentPage} OF {totalPages || 1}</div>
                                        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className={`p-1.5 border border-[#B2CADE]/40 bg-white rounded-lg transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#F2F4F6] text-[#2E395F] shadow-sm'}`}><LucideIcon name="chevron-right" size={16}/></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'oee' && (
                        <div className="flex flex-col gap-6 animate-fadeIn h-full">
                            <div className="bg-white/80 backdrop-blur-md rounded-none border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8">
                                <h3 className="font-black text-[#2E395F] flex items-center gap-2 uppercase tracking-widest mb-8 text-sm"><LucideIcon name="activity" size={18} className="text-[#C22D2E]" /> Overall Equipment Effectiveness (OEE)</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="flex flex-col items-center justify-center p-8 bg-[#F2F4F6]/50 rounded-2xl border border-[#E6E1DB] shadow-sm">
                                        <h4 className="text-[11px] font-black text-[#55738D] uppercase tracking-widest mb-6">Overall OEE</h4>
                                        <div className="relative w-44 h-44 flex items-center justify-center">
                                            <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E6E1DB" strokeWidth="8" />
                                                <circle cx="50" cy="50" r="40" fill="transparent" stroke={THEME.primary} strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 78) / 100} strokeLinecap="round" className="transition-all duration-1000" />
                                            </svg>
                                            <div className="absolute flex flex-col items-center justify-center">
                                                <span className="text-4xl font-black text-[#2E395F] font-mono">78<span className="text-xl text-[#737597]">%</span></span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-[#737597] mt-6 text-center font-bold uppercase tracking-widest bg-white px-3 py-1 rounded-md border border-[#E6E1DB]">Target: 85%</p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-[#E6E1DB] shadow-sm">
                                        <h4 className="text-[11px] font-black text-[#55738D] uppercase tracking-widest mb-6">Availability</h4>
                                        <div className="relative w-44 h-44 flex items-center justify-center">
                                            <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E6E1DB" strokeWidth="8" />
                                                <circle cx="50" cy="50" r="40" fill="transparent" stroke={THEME.info} strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * availability) / 100} strokeLinecap="round" className="transition-all duration-1000" />
                                            </svg>
                                            <div className="absolute flex flex-col items-center justify-center">
                                                <span className="text-4xl font-black text-[#2E395F] font-mono">{availability.toFixed(1)}<span className="text-xl text-[#737597]">%</span></span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-[#737597] mt-6 text-center font-bold uppercase tracking-widest">Operating / Planned</p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-[#E6E1DB] shadow-sm">
                                        <h4 className="text-[11px] font-black text-[#55738D] uppercase tracking-widest mb-6">Quality</h4>
                                        <div className="relative w-44 h-44 flex items-center justify-center">
                                            <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E6E1DB" strokeWidth="8" />
                                                <circle cx="50" cy="50" r="40" fill="transparent" stroke={THEME.success} strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 98.5) / 100} strokeLinecap="round" className="transition-all duration-1000" />
                                            </svg>
                                            <div className="absolute flex flex-col items-center justify-center">
                                                <span className="text-4xl font-black text-[#2E395F] font-mono">98.5<span className="text-xl text-[#737597]">%</span></span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-[#737597] mt-6 text-center font-bold uppercase tracking-widest">Good / Total Count</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-md rounded-none border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 flex-1">
                                <h3 className="font-black text-[#2E395F] flex items-center gap-2 uppercase tracking-widest mb-6 text-sm"><LucideIcon name="trending-up" size={18} className="text-[#C22D2E]" /> OEE Trend (Last 7 Days)</h3>
                                <div className="h-72 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={[
                                            { name: 'Mon', oee: 75, target: 85 }, { name: 'Tue', oee: 78, target: 85 },
                                            { name: 'Wed', oee: 82, target: 85 }, { name: 'Thu', oee: 76, target: 85 },
                                            { name: 'Fri', oee: 79, target: 85 }, { name: 'Sat', oee: 84, target: 85 },
                                            { name: 'Sun', oee: 78, target: 85 }
                                        ]}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6E1DB" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737597', fontFamily: 'JetBrains Mono' }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737597', fontFamily: 'JetBrains Mono' }} domain={[60, 100]} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E6E1DB', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }} />
                                            <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '20px', fontWeight: 'bold', color: '#2E395F' }} />
                                            <Line type="monotone" dataKey="oee" name="Actual OEE %" stroke={THEME.primary} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: 'white' }} activeDot={{ r: 6, fill: THEME.primary, stroke: 'white' }} />
                                            <Line type="monotone" dataKey="target" name="Target (85%)" stroke="#B2CADE" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'dashboard' && (
                        <div className="flex flex-col gap-6 animate-fadeIn h-full">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white/80 backdrop-blur-md rounded-none border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8">
                                    <h3 className="font-black text-[#2E395F] flex items-center gap-2 uppercase tracking-widest mb-6 text-sm"><LucideIcon name="bar-chart-2" size={18} className="text-[#C22D2E]" /> Downtime by Machine</h3>
                                    <div className="h-72 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={
                                                Object.values(breakdowns.reduce((acc: any, curr: any) => {
                                                    if (!acc[curr.machineName]) acc[curr.machineName] = { name: curr.machineName, downtime: 0 };
                                                    acc[curr.machineName].downtime += curr.downtimeMinutes;
                                                    return acc;
                                                }, {})).sort((a: any, b: any) => b.downtime - a.downtime).slice(0, 5)
                                            } layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E6E1DB" />
                                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737597', fontFamily: 'JetBrains Mono' }} />
                                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#2E395F', fontWeight: 'bold' }} width={120} />
                                                <Tooltip cursor={{ fill: '#F2F4F6' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E6E1DB', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }} />
                                                <Bar dataKey="downtime" name="Downtime (Min)" fill={THEME.primary} radius={[0, 4, 4, 0]} barSize={20} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="bg-white/80 backdrop-blur-md rounded-none border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8">
                                    <h3 className="font-black text-[#2E395F] flex items-center gap-2 uppercase tracking-widest mb-6 text-sm"><LucideIcon name="pie-chart" size={18} className="text-[#C22D2E]" /> Top Issues</h3>
                                    <div className="h-72 w-full flex items-center justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={
                                                        Object.values(breakdowns.reduce((acc: any, curr: any) => {
                                                            const prob = curr.problem.substring(0, 20) + (curr.problem.length > 20 ? '...' : '');
                                                            if (!acc[prob]) acc[prob] = { name: prob, value: 0 };
                                                            acc[prob].value += 1;
                                                            return acc;
                                                        }, {})).sort((a: any, b: any) => b.value - a.value).slice(0, 4)
                                                    }
                                                    cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value"
                                                >
                                                    {
                                                        [THEME.primary, THEME.warning, THEME.info, THEME.secondary].map((color, index) => (
                                                            <Cell key={`cell-${index}`} fill={color} stroke="none" />
                                                        ))
                                                    }
                                                </Pie>
                                                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E6E1DB', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }} />
                                                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#2E395F' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
