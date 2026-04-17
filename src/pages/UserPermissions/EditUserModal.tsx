import React, { useRef } from 'react';
import { motion } from 'motion/react';
import Draggable from 'react-draggable';
import { UserCog, Image as ImageIcon, Save, Lock, ChevronDown } from 'lucide-react';
import { MENU_ITEMS } from '../../config/menu';
import { PERMISSION_LEVELS } from './constants';

interface Props {
  formData: { name: string; position: string; email: string; avatar: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  modalStep: 1 | 2;
  setModalStep: (step: 1 | 2) => void;
  currentPermissions: Record<string, number[]>;
  setCurrentPermissions: React.Dispatch<React.SetStateAction<Record<string, number[]>>>;
  confidentialityMap: Record<string, boolean>;
  expandedModules: Record<string, boolean>;
  toggleExpand: (id: string) => void;
  handleSave: () => void;
  onClose: () => void;
}

const EditUserModal: React.FC<Props> = ({
  formData, handleInputChange, modalStep, setModalStep,
  currentPermissions, setCurrentPermissions, confidentialityMap,
  expandedModules, toggleExpand, handleSave, onClose
}) => {
  const nodeRef = useRef(null);

  const handlePermissionChange = (menuId: string, level: number) => {
    setCurrentPermissions(prev => {
      const currentLevels = prev[menuId] || [];
      let newLevels: number[];
      if (level === 0) {
        newLevels = [];
      } else {
        if (currentLevels.includes(level)) {
          newLevels = currentLevels.filter(l => l !== level);
        } else {
          newLevels = [...currentLevels, level].filter(l => l !== 0);
        }
      }
      return { ...prev, [menuId]: newLevels };
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm pointer-events-auto"
      />
      <Draggable nodeRef={nodeRef} handle=".modal-drag-handle" cancel="button, input, select, textarea">
        <div ref={nodeRef} className="relative w-full max-w-[1200px] h-[90vh] pointer-events-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full h-full bg-gray-50 rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col"
          >
            <div className="flex h-full">
              {/* Left: User Form */}
              <div className="w-1/3 bg-white border-r border-gray-200 p-6 flex flex-col overflow-y-auto">
                <h3 className="text-sm font-bold text-gray-900 uppercase mb-6 flex items-center gap-2 border-b border-gray-200 pb-3 modal-drag-handle cursor-move select-none">
                  <UserCog size={18} /> User Details
                </h3>
                
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group">
                    {formData.avatar ? <img src={formData.avatar} className="w-full h-full object-cover" alt="Avatar" /> : <ImageIcon size={32} className="text-gray-300" />}
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Image URL</label>
                    <input type="text" name="avatar" value={formData.avatar} onChange={handleInputChange} className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm border border-gray-200 focus:border-[#111f42] focus:ring-1 focus:ring-[#111f42] outline-none transition-all"/>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm border border-gray-200 focus:border-[#111f42] focus:ring-1 focus:ring-[#111f42] outline-none transition-all"/>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Position</label>
                    <input type="text" name="position" value={formData.position} onChange={handleInputChange} className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm border border-gray-200 focus:border-[#111f42] focus:ring-1 focus:ring-[#111f42] outline-none transition-all"/>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm border border-gray-200 focus:border-[#111f42] focus:ring-1 focus:ring-[#111f42] outline-none transition-all"/>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <button onClick={handleSave} className="w-full bg-[#111f42] text-white py-2.5 rounded-xl text-sm font-bold uppercase hover:bg-[#111f42]/90 transition-all flex items-center justify-center gap-2 shadow-sm">
                    <Save size={16} /> Save Changes
                  </button>
                  <button onClick={onClose} className="w-full mt-3 text-gray-500 text-xs font-bold uppercase hover:text-red-600 transition-colors">Cancel</button>
                </div>
              </div>

              {/* Right: Permission Tree */}
              <div className="w-2/3 p-6 flex flex-col overflow-hidden">
                {/* Stepper Header */}
                <div className="flex items-center gap-3 mb-6 bg-white p-3 rounded-xl border border-gray-200 shadow-sm modal-drag-handle cursor-move select-none">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${modalStep === 1 ? 'bg-[#F9F7F6] text-[#E3624A] shadow-sm' : 'text-gray-500'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${modalStep === 1 ? 'bg-[#111f42] text-white' : 'bg-gray-100 text-gray-500'}`}>1</div>
                    <span className="text-xs font-bold uppercase tracking-wider">Confidentiality</span>
                  </div>
                  <div className="h-px w-8 bg-gray-200"></div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${modalStep === 2 ? 'bg-[#F9F7F6] text-[#E3624A] shadow-sm' : 'text-gray-500'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${modalStep === 2 ? 'bg-[#111f42] text-white' : 'bg-gray-100 text-gray-500'}`}>2</div>
                    <span className="text-xs font-bold uppercase tracking-wider">Operational Rights</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-4 shrink-0">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {modalStep === 1 ? 'Step 1: Visibility & Confidentiality' : 'Step 2: Operational Permissions'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {modalStep === 1 
                        ? 'Define which modules this user can see. Confidential modules are restricted by default.' 
                        : 'Define what actions this user can perform (Edit, Verify, Approve).'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {PERMISSION_LEVELS.filter(p => {
                      if (modalStep === 1) return p.level <= 1;
                      return p.level === 0 || p.level >= 2;
                    }).map(p => (
                      <div key={p.level} className="flex items-center gap-1.5 bg-white border border-gray-200 px-2 py-1 rounded-md text-xs text-gray-600 font-medium">
                        <p.icon size={12} style={{color: p.color}} /> {p.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overflow-y-auto pr-2 space-y-3 flex-1">
                  {MENU_ITEMS.map((module) => {
                    const isExpanded = expandedModules[module.id];
                    const hasSub = module.subItems && module.subItems.length > 0;
                    const currentLevels = currentPermissions[module.id] || [];

                    return (
                      <div key={module.id} className={`bg-white rounded-xl border p-3 hover:shadow-sm transition-shadow ${module.isConfidential ? 'border-red-100' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center gap-3 ${hasSub ? 'cursor-pointer select-none' : ''}`} onClick={() => hasSub && toggleExpand(module.id)}>
                            <div className={`p-2 rounded-lg ${module.isConfidential ? 'bg-red-50 text-red-600' : 'bg-[#F9F7F6] text-[#111f42]'}`}>
                              <module.icon size={18} />
                            </div>
                            <span className="font-bold text-gray-900 text-sm uppercase tracking-wide flex items-center gap-2">
                              {module.name} 
                              {module.isConfidential && <Lock size={12} className="text-red-500" />}
                              {hasSub && <ChevronDown size={14} className={`text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}/>}
                            </span>
                          </div>
                          <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-200 gap-1">
                            {PERMISSION_LEVELS.filter(p => {
                              if (modalStep === 1) return p.level <= 1;
                              return p.level === 0 || p.level >= 2;
                            }).map((p) => {
                              const isActive = p.level === 0 
                                ? currentLevels.length === 0 || (modalStep === 2 && !currentLevels.some(l => l >= 2))
                                : currentLevels.includes(p.level);

                              return (
                                <button
                                  key={p.level}
                                  onClick={() => handlePermissionChange(module.id, p.level)}
                                  className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 relative group cursor-pointer
                                    ${isActive ? 'shadow-sm scale-105 z-10 ring-1 ring-black/5' : 'hover:bg-gray-200 opacity-60 hover:opacity-100 grayscale hover:grayscale-0'}
                                  `}
                                  style={{ backgroundColor: isActive ? p.bg : 'transparent' }}
                                  title={p.label}
                                >
                                  <p.icon size={14} style={{color: isActive ? p.color : '#64748B'}} />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        {hasSub && (
                          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                            <div className="pl-10 space-y-1 border-l-2 border-gray-100 ml-4 py-1">
                              {module.subItems?.map(sub => {
                                const subLevels = currentPermissions[sub.id] || [];
                                return (
                                  <div key={sub.id} className="flex items-center justify-between py-2 pl-4 pr-2 hover:bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-1.5 h-1.5 rounded-full ${sub.isConfidential || module.isConfidential ? 'bg-red-500' : 'bg-[#111f42]'}`}></div>
                                      <span className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                                        {sub.name}
                                        {(sub.isConfidential || module.isConfidential) && <Lock size={10} className="text-red-500" />}
                                      </span>
                                    </div>
                                    <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-200 gap-1 scale-90 origin-right">
                                      {PERMISSION_LEVELS.filter(p => {
                                        if (modalStep === 1) return p.level <= 1;
                                        return p.level === 0 || p.level >= 2;
                                      }).map((p) => {
                                        const isActive = p.level === 0 
                                          ? subLevels.length === 0 || (modalStep === 2 && !subLevels.some(l => l >= 2))
                                          : subLevels.includes(p.level);

                                        return (
                                          <button
                                            key={p.level}
                                            onClick={() => handlePermissionChange(sub.id, p.level)}
                                            className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 relative group cursor-pointer
                                              ${isActive ? 'shadow-sm scale-105 z-10 ring-1 ring-black/5' : 'hover:bg-gray-200 opacity-60 hover:opacity-100 grayscale hover:grayscale-0'}
                                            `}
                                            style={{ backgroundColor: isActive ? p.bg : 'transparent' }}
                                            title={p.label}
                                          >
                                            <p.icon size={14} style={{color: isActive ? p.color : '#64748B'}} />
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Step Navigation */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
                  {modalStep === 2 ? (
                    <button 
                      onClick={() => setModalStep(1)}
                      className="px-6 py-2 rounded-xl text-xs font-bold uppercase text-gray-700 border border-gray-300 hover:bg-gray-100 transition-all flex items-center gap-2"
                    >
                      Back to Step 1
                    </button>
                  ) : <div />}
                  
                  {modalStep === 1 ? (
                    <button 
                      onClick={() => setModalStep(2)}
                      className="px-8 py-2 bg-[#111f42] text-white rounded-xl text-xs font-bold uppercase shadow-sm hover:bg-[#111f42]/90 transition-all flex items-center gap-2"
                    >
                      Next: Operational Rights
                    </button>
                  ) : (
                    <button 
                      onClick={handleSave}
                      className="px-8 py-2 bg-green-600 text-white rounded-xl text-xs font-bold uppercase shadow-sm hover:bg-green-700 transition-all flex items-center gap-2"
                    >
                      <Save size={14} /> Finalize & Save
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Draggable>
    </div>
  );
};

export default EditUserModal;
