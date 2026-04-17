import React from 'react';
import { KPICard } from '../../../components/shared/DashboardKpiCard';
import { THEME } from '../constants';
import { CalendarDays } from 'lucide-react';

export const MixOverview = () => {
    return (
        <div className="w-full font-sans animate-fadeIn flex flex-col gap-6 h-full min-h-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
                <KPICard title="Total Daily Plan" val="120 Batches" color={THEME.primary} icon="clipboard-list" desc="Target for Today" />
                <KPICard title="Produced (Finished)" val="45 Batches" color={THEME.success} icon="check-circle" desc="Completed Base" />
                <KPICard title="Work In Process" val="12 Batches" color={THEME.info} icon="activity" desc="On Production Line" />
                <KPICard title="Overall Progress" val="37.5%" color={THEME.accent} icon="pie-chart" desc="Completion Rate" />
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-none border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col flex-1 min-h-0">
                 <div className="px-6 py-4 border-b border-[#E6E1DB] bg-[#F2F4F6]/50 flex justify-between items-center shrink-0">
                    <h3 className="font-black text-[#2E395F] flex items-center gap-2 uppercase tracking-widest text-[12px]">
                        <CalendarDays size={16} className="text-[#C22D2E]" /> Daily SFG Production Plan (Synced)
                    </h3>
                </div>
                <div className="flex-1 overflow-x-auto custom-scrollbar bg-transparent">
                    <table className="w-full text-left min-w-[900px] border-collapse">
                        <thead className="bg-[#C22D2E] border-b-[3px] border-[#2E395F] sticky top-0 z-10 text-white font-mono uppercase tracking-wider text-[11px] font-black">
                            <tr>
                                <th className="py-3 px-4 pl-6 whitespace-nowrap">Job ID</th>
                                <th className="py-3 px-4 whitespace-nowrap">SFG Name</th>
                                <th className="py-3 px-4 text-center whitespace-nowrap">Code</th>
                                <th className="py-3 px-4 text-center whitespace-nowrap">Target</th>
                                <th className="py-3 px-4 text-center whitespace-nowrap">Produced</th>
                                <th className="py-3 px-4 text-center whitespace-nowrap">WIP</th>
                                <th className="py-3 px-4 text-center whitespace-nowrap w-32">Progress</th>
                                <th className="py-3 px-4 text-center whitespace-nowrap">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#E6E1DB] text-[12px]">
                            <tr className="hover:bg-[#F2F4F6]/50 transition-colors">
                                <td className="py-2 px-4 pl-6 align-middle font-bold text-[#C22D2E] font-mono">JOB-SMC-001</td>
                                <td className="py-2 px-4 align-middle font-bold text-[#2E395F]">SFG Smoked Sausage (Standard)</td>
                                <td className="py-2 px-4 align-middle text-center"><span className="text-[10px] text-[#737597] font-mono border border-[#E6E1DB] bg-[#F2F4F6] px-1.5 py-0.5 rounded-md">SFG-SMC-001</span></td>
                                <td className="py-2 px-4 align-middle text-center font-mono font-black text-[#2E395F]">60</td>
                                <td className="py-2 px-4 align-middle text-center font-mono font-black text-[#537E72]">30</td>
                                <td className="py-2 px-4 align-middle text-center font-mono font-black text-[#55738D]">6</td>
                                <td className="py-2 px-4 align-middle text-center">
                                    <div className="w-full bg-[#E6E1DB] rounded-full h-1.5 overflow-hidden"><div className="bg-[#C22D2E] h-full rounded-full" style={{ width: `50%` }}></div></div>
                                    <span className="text-[9px] text-[#737597] mt-1 block font-mono font-bold">50%</span>
                                </td>
                                <td className="py-2 px-4 align-middle text-center"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm bg-white text-[#55738D] border-[#55738D]/40">In Progress</span></td>
                            </tr>
                            <tr className="hover:bg-[#F2F4F6]/50 transition-colors">
                                <td className="py-2 px-4 pl-6 align-middle font-bold text-[#C22D2E] font-mono">JOB-BOL-004</td>
                                <td className="py-2 px-4 align-middle font-bold text-[#2E395F]">SFG Chili Bologna Bar</td>
                                <td className="py-2 px-4 align-middle text-center"><span className="text-[10px] text-[#737597] font-mono border border-[#E6E1DB] bg-[#F2F4F6] px-1.5 py-0.5 rounded-md">SFG-BOL-004</span></td>
                                <td className="py-2 px-4 align-middle text-center font-mono font-black text-[#2E395F]">40</td>
                                <td className="py-2 px-4 align-middle text-center font-mono font-black text-[#537E72]">10</td>
                                <td className="py-2 px-4 align-middle text-center font-mono font-black text-[#55738D]">6</td>
                                <td className="py-2 px-4 align-middle text-center">
                                    <div className="w-full bg-[#E6E1DB] rounded-full h-1.5 overflow-hidden"><div className="bg-[#C22D2E] h-full rounded-full" style={{ width: `25%` }}></div></div>
                                    <span className="text-[9px] text-[#737597] mt-1 block font-mono font-bold">25%</span>
                                </td>
                                <td className="py-2 px-4 align-middle text-center"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm bg-white text-[#55738D] border-[#55738D]/40">In Progress</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
