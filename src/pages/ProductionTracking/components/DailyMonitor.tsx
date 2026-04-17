import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as Icons from 'lucide-react';
import { GuideTrigger, LucideIcon } from '../../../components/shared/SharedUI';
import { UserGuidePanel } from '../../../components/shared/UserGuidePanel';
import { KPICard } from '../../../components/shared/DashboardKpiCard';

const STAGES = [
    { key: 'mixing', label: 'Mixing', icon: 'chef-hat', color: '#55738D', id: 'Mixing' },
    { key: 'forming', label: 'Forming', icon: 'component', color: '#DCBC1B', id: 'Forming' },
    { key: 'steaming', label: 'Steaming', icon: 'thermometer', color: '#C22D2E', id: 'Steaming' },
    { key: 'cooling', label: 'Cooling', icon: 'snowflake', color: '#90B7BF', id: 'Cooling' },
    { key: 'cutting', label: 'Cut/Peel', icon: 'scissors', color: '#BB8588', id: 'Cutting' },
    { key: 'packing', label: 'Packing', icon: 'package', color: '#2E395F', id: 'Packing' },
    { key: 'warehouse', label: 'Warehouse (FG)', icon: 'archive', color: '#537E72', id: 'Warehouse' }
];

function CompactStageCell({ stageKey, label, currentCount, totalTarget, prevStageCount, isFirstStage, lastUpdate, color }: any) {
    const maxPossible = isFirstStage ? totalTarget : prevStageCount;
    const percentage = totalTarget > 0 ? Math.round((currentCount / totalTarget) * 100) : 0;
    const isCompleted = percentage === 100;
    
    return (
        <div className="flex flex-col items-center justify-center relative group/cell h-full px-1 cursor-default font-sans border-l border-[#F2F4F6] first:border-l-0">
            <div className={`text-[11px] font-black mb-1 ${isCompleted ? 'text-[#537E72]' : 'text-[#2E395F]'}`}>
                {currentCount}
            </div>

            <div className="w-full h-1.5 bg-[#E6E1DB] rounded-full overflow-hidden mb-1 relative">
                <div 
                    className="h-full transition-all duration-500 absolute top-0 left-0"
                    style={{ 
                        width: `${percentage}%`,
                        backgroundColor: isCompleted ? '#537E72' : (percentage > 0 ? color : 'transparent') 
                    }}
                />
            </div>

            {/* Tooltip */}
            {lastUpdate ? (
                <div className="absolute bottom-full mb-2 hidden group-hover/cell:flex flex-col items-center z-50 w-max pointer-events-none animate-fadeIn">
                    <div className="bg-[#141619]/95 backdrop-blur text-white text-xs rounded-lg shadow-xl p-2 flex flex-col gap-1 items-center border border-white/10">
                        <span className="font-bold text-[#DCBC1B] uppercase tracking-wide">{label} Update</span>
                        <span className="text-[10px] text-gray-300 flex items-center gap-1 font-mono">
                            <LucideIcon name="clock" size={10} /> {lastUpdate}
                        </span>
                    </div>
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#141619]/95 mx-auto"></div>
                </div>
            ) : (
                 <div className="absolute bottom-full mb-2 hidden group-hover/cell:flex flex-col items-center z-50 w-max pointer-events-none animate-fadeIn">
                    <div className="bg-[#55738D] text-white text-[9px] rounded px-2 py-1 opacity-90 shadow-sm uppercase tracking-widest">
                        Waiting Update
                    </div>
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#55738D] mx-auto"></div>
                </div>
            )}
        </div>
    );
}

function OrderRow({ order }: any) {
    const overallProgress = order.totalBatches > 0 
        ? Math.round((order.stages.warehouse / order.totalBatches) * 100) 
        : 0;

    const latestUpdate = useMemo(() => {
        if (!order.stageUpdates) return null;
        const entries = Object.entries(order.stageUpdates);
        if (entries.length === 0) return null;
        entries.sort((a, b) => (b[1] as string).localeCompare(a[1] as string));
        return { time: entries[0][1] as string, stage: entries[0][0] };
    }, [order.stageUpdates]);

    return (
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-[#E6E1DB] hover:bg-white transition-all duration-300 p-0 grid grid-cols-12 items-stretch group overflow-hidden min-h-[64px] relative hover:z-20 rounded-none last:border-b-0">
            <div className="col-span-3 border-r border-[#F2F4F6] p-3 flex flex-col justify-center bg-white/40">
                <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#F2F4F6] text-[#55738D] font-bold font-mono border border-[#E6E1DB]">
                        {order.id}
                    </span>
                    <span className="text-[10px] text-[#737597] flex items-center gap-1 font-bold">
                       <LucideIcon name="user" size={10} /> {order.client}
                    </span>
                </div>
                <h3 className="text-[12px] font-black truncate leading-tight mb-1 group-hover:text-[#C22D2E] transition-colors text-[#2E395F]">
                    {order.sku}
                </h3>
                <div className="flex items-center justify-between text-xs text-[#737597] mt-1.5">
                    <div className="flex items-center gap-1 font-bold text-[10px]">
                        <LucideIcon name="target" size={12} color="#C22D2E"/>
                        <span>{order.totalBatches} Batches</span>
                    </div>
                    {latestUpdate && (
                        <div className="group/time relative cursor-help">
                            <div className="flex items-center gap-1 text-[9px] text-[#55738D] font-bold bg-[#F2F4F6] px-1.5 py-0.5 rounded-full border border-[#E6E1DB]">
                                <LucideIcon name="clock" size={10} />
                                <span>{latestUpdate.time}</span>
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover/time:block z-50 w-max pointer-events-none animate-fadeIn">
                                <div className="bg-[#141619] text-white text-[9px] px-2 py-1 rounded shadow-lg capitalize tracking-widest">Latest: {latestUpdate.stage}</div>
                                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#141619] mx-auto"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="col-span-8 grid grid-cols-7 h-full">
                {STAGES.map((stage, index) => {
                    const prevStageKey = index > 0 ? STAGES[index - 1].key : null;
                    const prevStageCount = prevStageKey ? (order.stages as any)[prevStageKey] : order.totalBatches;
                    const stageUpdate = order.stageUpdates ? (order.stageUpdates as any)[stage.key] : null;

                    return (
                        <CompactStageCell 
                            key={stage.key}
                            stageKey={stage.key}
                            label={stage.label}
                            color={stage.color}
                            currentCount={(order.stages as any)[stage.key]}
                            totalTarget={order.totalBatches}
                            prevStageCount={prevStageCount}
                            isFirstStage={index === 0}
                            lastUpdate={stageUpdate}
                        />
                    );
                })}
            </div>
            <div className="col-span-1 flex flex-col items-center justify-center border-l border-[#F2F4F6] bg-[#F2F4F6]/50 group-hover:bg-[#F2F4F6] transition-colors">
                <div className="relative w-10 h-10 flex items-center justify-center">
                   <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-[#E6E1DB]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                        <path className="transition-all duration-1000 ease-out" 
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                            fill="none" 
                            stroke={overallProgress === 100 ? '#537E72' : '#DCBC1B'} 
                            strokeWidth="3" 
                            strokeDasharray={`${overallProgress}, 100`} 
                        />
                    </svg>
                    <span className="absolute text-[9px] font-black text-[#2E395F] font-mono">{overallProgress}%</span>
                </div>
            </div>
        </div>
    );
}

export function DailyMonitor({ data }: any) {
    const [searchQuery, setSearchQuery] = useState('');
    const [subTab, setSubTab] = useState('In Progress'); 
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredData = useMemo(() => {
        let res = data.filter((d: any) => d.status !== 'Completed');
        
        if (subTab === 'Not Started') res = res.filter((d: any) => d.status === 'Pending');
        else if (subTab === 'In Progress') res = res.filter((d: any) => d.status === 'In Progress');

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            res = res.filter((d: any) => d.sku.toLowerCase().includes(q) || d.id.toLowerCase().includes(q) || d.client.toLowerCase().includes(q));
        }
        return res;
    }, [data, subTab, searchQuery]);

    const SUB_TABS = [
        { id: 'All', label: 'All Active', count: data.filter((d: any) => d.status !== 'Completed').length },
        { id: 'Not Started', label: 'Not Started', count: data.filter((d: any) => d.status === 'Pending').length },
        { id: 'In Progress', label: 'In Progress', count: data.filter((d: any) => d.status === 'In Progress').length },
    ];
    
    const activeTabObj = SUB_TABS.find(t => t.id === subTab) || SUB_TABS[0];

    return (
        <div className="flex flex-col h-full overflow-hidden animate-fadeIn relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0 mb-4">
                <KPICard title="Total Planned" val={`${data.reduce((s: number,o: any)=>s+o.totalBatches,0)}`} color="#C22D2E" icon="target" desc="Output Batches" />
                <KPICard title="Pending Start" val={`${data.filter((o: any)=>o.status==='Pending').length}`} color="#737597" icon="clock" desc="Waiting Orders" />
                <KPICard title="In Progress" val={`${data.filter((o: any)=>o.status==='In Progress').length}`} color="#55738D" icon="activity" desc="Line Active" />
                <KPICard title="Total WIP" val={`${data.reduce((s: number,o: any)=>s+(o.stages.cutting - o.stages.packing), 0)}`} color="#DCBC1B" icon="layers" desc="Wait Packing" />
            </div>

            {/* การ์ดตาราง (Rounded-none) */}
            <div className="bg-white/80 backdrop-blur-md rounded-none border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col flex-1 min-h-0">
                <div className="px-6 py-4 border-b border-[#E6E1DB] flex flex-col md:flex-row justify-between items-center bg-[#F2F4F6]/50 shrink-0 gap-4">
                    
                    {/* Dropdown Filter */}
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center justify-between gap-4 px-4 py-2.5 bg-white rounded-lg border border-[#E6E1DB] shadow-sm text-[10px] uppercase tracking-widest font-black text-[#2E395F] min-w-[200px] hover:border-[#B2CADE] transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-[#737597] mr-1 font-bold">Status |</span>
                                {activeTabObj.label}
                                <span className="px-1.5 py-0.5 rounded-sm text-[9px] bg-[#C22D2E]/10 text-[#C22D2E]">{activeTabObj.count}</span>
                            </div>
                            <LucideIcon name="chevron-down" size={14} className={`transition-transform text-[#737597] ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 mt-1.5 w-full bg-white border border-[#E6E1DB] rounded-lg shadow-lg z-50 overflow-hidden animate-fadeIn">
                                {SUB_TABS.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => { setSubTab(tab.id); setIsDropdownOpen(false); }}
                                        className={`w-full flex items-center justify-between px-4 py-3 text-[10px] uppercase tracking-widest font-black transition-colors ${
                                            subTab === tab.id ? 'bg-[#F2F4F6] text-[#C22D2E]' : 'text-[#737597] hover:bg-[#F2F4F6] hover:text-[#2E395F]'
                                        }`}
                                    >
                                        {tab.label}
                                        <span className={`px-1.5 py-0.5 rounded-sm text-[9px] ${
                                            subTab === tab.id ? 'bg-[#C22D2E]/10 text-[#C22D2E]' : 'bg-[#E6E1DB] text-[#737597]'
                                        }`}>
                                            {tab.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative w-full md:w-64">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55738D]"><LucideIcon name="search" size={14} /></div>
                        <input type="text" placeholder="Search Active Order..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 text-[12px] rounded-xl border border-[#B2CADE]/50 focus:outline-none focus:border-[#2E395F] bg-white font-bold text-[#2E395F] shadow-sm h-10" />
                    </div>
                </div>

                {/* หัวตาราง (Red Meat & py-4) */}
                <div className="grid grid-cols-12 gap-4 px-3 py-4 text-[10px] font-black text-white uppercase tracking-wider bg-[#C22D2E] border-b-[3px] border-[#2E395F] shrink-0 z-20">
                    <div className="col-span-3 pl-4">Order / Product Info</div>
                    <div className="col-span-8 grid grid-cols-7 text-center">
                        {STAGES.map(s => (
                            <div key={s.key} className="flex items-center justify-center gap-1">
                                <LucideIcon name={s.icon} size={12} /> <span className="hidden xl:inline">{s.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="col-span-1 text-center">Progress</div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar bg-transparent">
                    {filteredData.map((order: any) => (
                        <OrderRow key={order.id} order={order} />
                    ))}
                    {filteredData.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-[#737597] opacity-50 py-10">
                            <LucideIcon name="search-x" size={48} className="mb-4" />
                            <span className="font-bold uppercase tracking-widest text-[12px]">No active orders found</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
