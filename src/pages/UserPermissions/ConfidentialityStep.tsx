import React from 'react';
import { Lock, Eye, ChevronDown } from 'lucide-react';
import { MENU_ITEMS } from '../../config/menu';

interface Props {
  confidentialityMap: Record<string, boolean>;
  toggleConfidentiality: (id: string) => void;
  expandedModules: Record<string, boolean>;
  toggleExpand: (id: string) => void;
}

const ConfidentialityStep: React.FC<Props> = ({ confidentialityMap, toggleConfidentiality, expandedModules, toggleExpand }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      <div className="md:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Lock size={20} className="text-[#111f42]" />
            Confidentiality Rules
          </h3>
          <div className="space-y-4 mt-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="flex items-center gap-2 text-green-700 font-bold text-xs uppercase tracking-wider mb-1">
                <Eye size={16} /> Public (No Lock)
              </div>
              <p className="text-sm text-green-600 leading-relaxed">
                Every logged-in user will have <strong>Read Only</strong> access by default. Specific rights can be added in Step 2.
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wider mb-1">
                <Lock size={16} /> Confidential (Locked)
              </div>
              <p className="text-sm text-red-600 leading-relaxed">
                Only users explicitly assigned in <strong>Step 2</strong> will have access. Others will have <strong>No Access</strong>.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg text-white">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#72A09E] mb-4">Quick Summary</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
              <span className="text-gray-400">Total Modules</span>
              <span className="font-bold">{MENU_ITEMS.length}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
              <span className="text-gray-400">Confidential</span>
              <span className="font-bold text-red-400">{Object.values(confidentialityMap).filter(v => v).length}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
              <span className="text-gray-400">Public</span>
              <span className="font-bold text-green-400">{Object.values(confidentialityMap).filter(v => !v).length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[70vh]">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Module Configuration</h3>
          <span className="text-xs font-medium text-gray-500">Toggle Lock to set Confidentiality</span>
        </div>
        <div className="overflow-y-auto p-6 space-y-4">
          {MENU_ITEMS.map(module => {
            const isConfidential = confidentialityMap[module.id];
            const hasSub = module.subItems && module.subItems.length > 0;
            const isExpanded = expandedModules[module.id];

            return (
              <div key={module.id} className="space-y-2">
                <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isConfidential ? 'bg-red-50/50 border-red-100' : 'bg-white border-gray-200 hover:border-[#72A09E]'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${isConfidential ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                      <module.icon size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                        {module.name}
                        {hasSub && (
                          <button onClick={() => toggleExpand(module.id)} className="p-1 hover:bg-gray-200 rounded transition-colors">
                            <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 font-medium mt-0.5">
                        {isConfidential ? 'Restricted Access' : 'Public Access (Read Only for all)'}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleConfidentiality(module.id)}
                    className={`p-2 rounded-lg transition-all ${isConfidential ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                  >
                    {isConfidential ? <Lock size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {hasSub && isExpanded && (
                  <div className="ml-12 space-y-2">
                    {module.subItems?.map(sub => {
                      const subConfidential = confidentialityMap[sub.id];
                      return (
                        <div key={sub.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${subConfidential ? 'bg-red-50/50 border-red-100' : 'bg-gray-50 border-gray-200'}`}>
                          <span className="text-sm font-medium text-gray-700">{sub.name}</span>
                          <button 
                            onClick={() => toggleConfidentiality(sub.id)}
                            className={`p-1.5 rounded transition-all ${subConfidential ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}
                          >
                            {subConfidential ? <Lock size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ConfidentialityStep;
