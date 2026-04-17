import React, { useState, useMemo } from 'react';
import { ArrowUpDown, Search, Filter, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { clsx } from 'clsx';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  className?: string;
}

export function DataTable({ columns, data, onRowClick, className }: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [dateFilter, setDateFilter] = useState({ month: '', year: '' });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = useMemo(() => {
    return data.filter(row => {
      // General Column Filters
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return String(row[key]).toLowerCase().includes(String(value).toLowerCase());
      });

      // Date Filters (Month/Year)
      const matchesDate = () => {
        if (!dateFilter.month && !dateFilter.year) return true;
        const date = new Date(row.date || row.timestamp || row.createdAt);
        if (isNaN(date.getTime())) return true; // Skip if no valid date field

        const matchesMonth = dateFilter.month ? (date.getMonth() + 1) === parseInt(dateFilter.month) : true;
        const matchesYear = dateFilter.year ? date.getFullYear() === parseInt(dateFilter.year) : true;
        return matchesMonth && matchesYear;
      };

      return matchesFilters && matchesDate();
    }).sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, filters, dateFilter, sortConfig]);

  return (
    <div className={clsx("bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm", className)}>
      {/* Date Filter Bar */}
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-slate-400" />
          <span className="text-[10px] font-black text-[#111f42] uppercase tracking-widest">Filter by Date:</span>
        </div>
        <select 
          value={dateFilter.month}
          onChange={(e) => setDateFilter(prev => ({ ...prev, month: e.target.value }))}
          className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider focus:ring-2 focus:ring-[#111f42] outline-none"
        >
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('en-US', { month: 'long' })}
            </option>
          ))}
        </select>
        <select 
          value={dateFilter.year}
          onChange={(e) => setDateFilter(prev => ({ ...prev, year: e.target.value }))}
          className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider focus:ring-2 focus:ring-[#111f42] outline-none"
        >
          <option value="">All Years</option>
          {[2024, 2025, 2026].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        {(dateFilter.month || dateFilter.year) && (
          <button 
            onClick={() => setDateFilter({ month: '', year: '' })}
            className="text-[9px] font-black text-[#E3624A] uppercase tracking-widest hover:underline"
          >
            Clear Date
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 border-b border-slate-100">
                  <div className="flex flex-col gap-2">
                    <div 
                      className={clsx(
                        "flex items-center gap-2 text-[10px] font-black text-[#111f42] uppercase tracking-widest",
                        col.sortable && "cursor-pointer hover:text-[#E3624A] transition-colors"
                      )}
                      onClick={() => col.sortable && handleSort(col.key)}
                    >
                      {col.label}
                      {col.sortable && (
                        <span className="text-slate-300">
                          {sortConfig?.key === col.key ? (
                            sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          ) : <ArrowUpDown size={14} />}
                        </span>
                      )}
                    </div>
                    {col.filterable && (
                      <div className="relative">
                        <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input 
                          type="text"
                          placeholder="Filter..."
                          value={filters[col.key] || ''}
                          onChange={(e) => setFilters(prev => ({ ...prev, [col.key]: e.target.value }))}
                          className="w-full bg-white border border-slate-200 rounded-md pl-6 pr-2 py-1 text-[9px] font-medium placeholder:text-slate-300 focus:ring-1 focus:ring-[#111f42] outline-none"
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredData.length > 0 ? (
              filteredData.map((row, i) => (
                <tr 
                  key={i} 
                  onClick={() => onRowClick?.(row)}
                  className={clsx(
                    "hover:bg-slate-50/50 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-xs font-medium text-slate-600">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <Filter size={24} className="opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No matching data found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
