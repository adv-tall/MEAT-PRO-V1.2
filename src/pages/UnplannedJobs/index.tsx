import React, { useState, useMemo } from 'react';
import { Search, Plus, Upload, Filter, Briefcase } from 'lucide-react';
import { KPICard } from '../../components/shared/DashboardKpiCard';
import { DataTable } from '../../components/shared/DataTable';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { CsvUpload } from '../../components/shared/CsvUpload';
import { CsvExport } from '../../components/shared/CsvExport';
import { motion } from 'motion/react';

const MOCK_JOBS = [
    { id: 'UPJ-260401', item: 'Beef Mince Special', description: 'Urgent refill for supermarket B', qty: 500, dept: 'Mixing', date: '2026-04-17', status: 'Pending' },
    { id: 'UPJ-260402', item: 'Chicken Sausage (Spicy)', description: 'Replace damaged lot LOT-2401', qty: 200, dept: 'Packing', date: '2026-04-16', status: 'In Progress' },
    { id: 'UPJ-260403', item: 'Pork Belly Sliced', description: 'VIP Client Add-on', qty: 150, dept: 'Slicing', date: '2026-04-15', status: 'Completed' },
];

export default function UnplannedJobs() {
    const [jobs, setJobs] = useState(MOCK_JOBS);
    const [searchTerm, setSearchTerm] = useState('');
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    
    // KPI Data
    const totalJobs = jobs.length;
    const pending = jobs.filter(j => j.status === 'Pending').length;
    const inProgress = jobs.filter(j => j.status === 'In Progress').length;
    const completed = jobs.filter(j => j.status === 'Completed').length;

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => 
            job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [jobs, searchTerm]);

    const handleImportCsv = (data: any[]) => {
        const newJobs = data.map((row, idx) => ({
            id: row['Job ID'] || `UPJ-NEW-${Date.now()}-${idx}`,
            item: row['Item SKU'] || 'Unknown Item',
            description: row['Description'] || '',
            qty: parseInt(row['Quantity']) || 0,
            dept: row['Department'] || 'General',
            date: row['Date'] || new Date().toISOString().split('T')[0],
            status: row['Status'] || 'Pending'
        }));
        
        setJobs(prev => [...newJobs, ...prev]);
        setIsImportModalOpen(false);
    };

    const columns = [
        { key: 'id', label: 'Job ID', sortable: true },
        { key: 'item', label: 'Item / SKU', sortable: true, filterable: true },
        { key: 'description', label: 'Description' },
        { 
            key: 'qty', 
            label: 'Quantity', 
            sortable: true,
            render: (val: any) => <span className="font-mono">{val} kg</span> 
        },
        { key: 'dept', label: 'Department', sortable: true, filterable: true },
        { key: 'date', label: 'Date', sortable: true },
        { 
            key: 'status', 
            label: 'Status', 
            sortable: true,
            filterable: true,
            render: (val: any) => {
                let colorClass = 'bg-gray-100 text-gray-800';
                if (val === 'Pending') colorClass = 'bg-[#F2F4F6] text-[#2E395F] font-semibold border border-[#2E395F]/20';
                if (val === 'In Progress') colorClass = 'bg-[#D8A48F]/20 text-[#D8A48F] font-semibold border border-[#D8A48F]/30';
                if (val === 'Completed') colorClass = 'bg-[#537E72]/20 text-[#537E72] font-semibold border border-[#537E72]/30';
                
                return <span className={`px-3 py-1 rounded-full text-xs ${colorClass}`}>{val}</span>;
            }
        }
    ];

    return (
        <div className="flex flex-col min-h-screen w-full font-sans px-8 pt-8 pb-10" style={{ background: `linear-gradient(135deg, #F2F4F6 0%, #E6E1DB 100%)` }}>
            {/* Header section (compact) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeIn mb-6 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm border border-white/60 rounded-xl text-[#2E395F]">
                        <Briefcase size={24} className="text-[#C22D2E]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-[#2E395F] tracking-tight uppercase">Unplanned Jobs</h1>
                        <p className="text-sm font-medium text-[#55738D] mt-0.5">Manage and track ad-hoc production orders</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsImportModalOpen(true)}
                        className="bg-white hover:bg-slate-50 text-[#2E395F] px-4 py-2 rounded-xl text-sm font-bold shadow-sm border border-white/60 transition-all flex items-center gap-2"
                    >
                        <Upload size={16} className="text-[#55738D]" /> Import CSV
                    </button>
                    <CsvExport 
                        data={jobs} 
                        filename="unplanned_jobs_export" 
                        label="Export CSV" 
                    />
                    <button className="bg-[#C22D2E] hover:bg-[#A02020] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2">
                        <Plus size={16} /> New Job
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 shrink-0">
                <KPICard title="Total Jobs" val={totalJobs.toString()} icon="briefcase" color="#2E395F" />
                <KPICard title="Pending" val={pending.toString()} icon="alert-triangle" color="#D8A48F" />
                <KPICard title="In Progress" val={inProgress.toString()} icon="play-circle" color="#55738D" />
                <KPICard title="Completed" val={completed.toString()} icon="check-circle" color="#537E72" />
            </div>

            {/* Data Table Container */}
            <div className="flex-1 bg-white/80 backdrop-blur-md rounded-none border border-white/60 shadow-sm flex flex-col min-h-0 overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/50 shrink-0">
                    <div className="flex items-center gap-2 text-sm font-black text-[#2E395F] uppercase tracking-widest">
                        <Briefcase size={16} className="text-[#C22D2E]" />
                        Job Priority Queue
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text"
                                placeholder="Search by ID, Item, Description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C22D2E]/20 focus:border-[#C22D2E] transition-all"
                            />
                        </div>
                        <button className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
                            <Filter size={16} />
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-auto custom-scrollbar p-0">
                    <DataTable 
                        data={filteredJobs}
                        columns={columns}
                    />
                </div>
            </div>

            {/* Modals */}
            <DraggableModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                title="Bulk Import Unplanned Jobs"
                width="max-w-4xl"
            >
                <div className="p-6">
                    <CsvUpload 
                        onUpload={handleImportCsv}
                        requiredHeaders={["Job ID", "Item SKU", "Description", "Quantity", "Department", "Date", "Status"]}
                        templateName="unplanned_jobs_template.csv"
                        instructions={[
                            "Upload a CSV file containing your unplanned jobs data.",
                            "The file must include the exact headers listed above.",
                            "Use a comma as the delimiter.",
                            "Maximum file size is 10MB."
                        ]}
                    />
                </div>
            </DraggableModal>

        </div>
    );
}
