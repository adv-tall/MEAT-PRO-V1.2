import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { LucideIcon } from '../../../components/shared/SharedUI';
import { StandardModalWrapper } from '../../../components/shared/StandardModalWrapper';
import { ListManagerModal } from './ListManagerModal';

const STANDARD_BATCH_SIZES = [100, 150];

export function ConfigModal({ isOpen, onClose, data, onSave, mode, categories }: any) {
    const [topTab, setTopTab] = useState('info');
    const [activeTab, setActiveTab] = useState('batter');
    const [config, setConfig] = useState<any>(null);
    const [settingsMode, setSettingsMode] = useState<any>(null);
    const [options, setOptions] = useState<any>({
        machineMixing: ['Bowl Cutter 200L', 'Bowl Cutter 500L', 'Vacuum Mixer', 'Emulsifier'],
        batterFormulas: ['Standard Pork', 'Premium Beef', 'Chicken A'],
        productSizes: ['S', 'M', 'L', 'Jumbo', 'Cocktail'],
        formingTypes: ['Twist Linker', 'Clipper Direct', 'Belt Former'],
        casingTypes: ['Cellulose', 'Collagen', 'Polyamide'],
        cookingOvens: ['Smoke House 4T', 'Smoke House 6T'],
        cookingPrograms: ['Steam_01', 'Smoke_Std'],
        coolingUnits: ['Blast Chiller', 'Shower Tunnel'],
        coolingPrograms: ['Chill_Std', 'Shower_Fast'],
        peelingMethods: ['Machine Only', 'Manual'],
        packingMachines: ['Thermoformer', 'Flow Pack', 'Vacuum Chamber'],
        packSizes: ['500g', '1kg', 'Bulk'],
        packFormats: ['Bag', 'Tray'],
        cuttingMachines: ['Auto Slicer', 'Dicer'],
        bladeTypes: ['Smooth', 'Serrated']
    });
    
    const DEFAULT_CONFIG = {
        id: '', name: '', category: categories[0], status: 'Active',
        rawWeightPerBatch: 150.00, yieldPercent: 100, specPiecesPerKg: 0,
        mixingStandards: [], formingStandards: [], cookingStandards: [],
        coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [],
        packVariants: []
    };

    useEffect(() => {
        if (isOpen) {
            setTopTab('info');
            if (data) {
                setConfig({
                    ...DEFAULT_CONFIG,
                    ...data,
                    mixingStandards: [...(data.mixingStandards || [])],
                    formingStandards: [...(data.formingStandards || [])],
                    cookingStandards: [...(data.cookingStandards || [])],
                    coolingStandards: [...(data.coolingStandards || [])],
                    peelingStandards: [...(data.peelingStandards || [])],
                    cuttingStandards: [...(data.cuttingStandards || [])],
                    packingStandards: [...(data.packingStandards || [])],
                    packVariants: [...(data.packVariants || [])]
                });
            } else {
                setConfig(DEFAULT_CONFIG);
            }
            setActiveTab('batter');
        }
    }, [isOpen, data]);

    if (!isOpen || !config) return null;

    const isReadOnly = mode === 'view';

    const handleSaveClick = () => {
        onSave(config);
        onClose();
        Swal.fire({ icon: 'success', title: 'Saved Successfully', showConfirmButton: false, timer: 1000 });
    };

    const updateArrayItem = (arrayName: string, id: number, field: string, value: any) => {
        setConfig((prev: any) => ({
            ...prev,
            [arrayName]: prev[arrayName].map((item: any) => item.id === id ? { ...item, [field]: value } : item)
        }));
    };

    const removeArrayItem = (arrayName: string, id: number) => {
        setConfig((prev: any) => ({
            ...prev,
            [arrayName]: prev[arrayName].filter((item: any) => item.id !== id)
        }));
    };

    const addArrayItem = (arrayName: string, newItem: any) => {
        const newId = config[arrayName].length > 0 ? Math.max(...config[arrayName].map((i: any) => i.id)) + 1 : 1;
        setConfig((prev: any) => ({
            ...prev,
            [arrayName]: [...prev[arrayName], { ...newItem, id: newId }]
        }));
    };

    const handleUpdateOption = (key: string, newList: any[]) => {
        setOptions((prev: any) => ({ ...prev, [key]: newList }));
    };

    const TabButton = ({ id, label, icon }: any) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-3 px-5 py-4 text-left transition-all border-l-4 w-full group ${activeTab === id ? 'border-[#C22D2E] bg-white text-[#C22D2E] shadow-sm' : 'border-transparent text-[#737597] hover:bg-[#E6E1DB]/30 hover:text-[#2E395F]'}`}
        >
            <div className={`p-2 rounded-xl shrink-0 transition-colors ${activeTab === id ? 'bg-[#C22D2E]/10' : 'bg-white border border-[#E6E1DB] group-hover:border-[#B2CADE]'}`}>
                <LucideIcon name={icon} size={16} />
            </div>
            <span className={`text-[11px] uppercase tracking-widest ${activeTab === id ? 'font-black' : 'font-bold'}`}>{label}</span>
        </button>
    );

    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-[#141619]/60 backdrop-blur-sm p-4 animate-fadeIn font-sans">
            <StandardModalWrapper className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden relative border border-white/40">
                
                {/* Header */}
                <div className="bg-[#2E395F] px-8 py-5 flex justify-between items-start shrink-0 border-b border-[#E6E1DB] modal-handle cursor-move">
                    <div className="flex items-center gap-4 pointer-events-none">
                        <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20">
                            <LucideIcon name={mode === 'view' ? 'eye' : 'settings-2'} size={24} className="text-[#DCBC1B]" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-widest leading-tight">{config.name || 'New Process Standard'}</h3>
                            <p className="text-[11px] text-[#90B7BF] font-mono font-bold tracking-widest mt-1">ID: {config.id || 'AUTO-GEN'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-xl"><LucideIcon name="x" size={20} /></button>
                </div>

                {/* Content Layout */}
                <div className="flex flex-1 overflow-hidden bg-[#F2F4F6]">
                    {/* Sidebar Nav */}
                    <div className="w-64 bg-white border-r border-[#E6E1DB] flex flex-col shrink-0 overflow-y-auto">
                        <div className="px-5 py-4 text-[10px] font-black text-[#55738D] uppercase tracking-widest border-b border-[#E6E1DB] bg-[#F2F4F6]">Process Steps</div>
                        <TabButton id="batter" label="General / Batter" icon="file-text" />
                        <TabButton id="mixing" label="1. Mixing" icon="chef-hat" />
                        <TabButton id="forming" label="2. Forming" icon="component" />
                        <TabButton id="cooking" label="3. Cooking" icon="thermometer" />
                        <TabButton id="cooling" label="4. Cooling" icon="snowflake" />
                        <TabButton id="peeling" label="5. Peeling" icon="scissors" />
                        <TabButton id="cutting" label="6. Cutting" icon="scissors" />
                        <TabButton id="packing" label="7. Packing" icon="package" />
                        <TabButton id="variants" label="8. Pack Variants" icon="layers" />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                        
                        {/* 0. General / Batter */}
                        {activeTab === 'batter' && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="bg-white p-8 rounded-2xl border border-[#E6E1DB] shadow-sm">
                                    <h4 className="text-[12px] font-black text-[#2E395F] border-b border-[#E6E1DB] pb-3 mb-6 uppercase tracking-widest">Product Information</h4>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Standard Name</label>
                                            <input disabled={isReadOnly} type="text" value={config.name} onChange={e=>setConfig({...config, name: e.target.value})} className={`w-full border border-[#B2CADE] rounded-xl p-3 text-[12px] font-bold focus:border-[#C22D2E] outline-none transition-all ${isReadOnly ? 'bg-[#F2F4F6] text-[#737597]' : 'bg-[#F2F4F6] focus:bg-white text-[#2E395F]'}`} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Category</label>
                                            <select disabled={isReadOnly} value={config.category} onChange={e=>setConfig({...config, category: e.target.value})} className={`w-full border border-[#B2CADE] rounded-xl p-3 text-[12px] font-bold focus:border-[#C22D2E] outline-none transition-all cursor-pointer ${isReadOnly ? 'bg-[#F2F4F6] text-[#737597]' : 'bg-[#F2F4F6] focus:bg-white text-[#2E395F]'}`}>
                                                {categories.filter((c: string) => c !== 'All').map((c: string) => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Status</label>
                                            <select disabled={isReadOnly} value={config.status || 'Active'} onChange={e=>setConfig({...config, status: e.target.value})} className={`w-full border border-[#B2CADE] rounded-xl p-3 text-[12px] font-bold focus:border-[#C22D2E] outline-none transition-all cursor-pointer ${isReadOnly ? 'bg-[#F2F4F6] text-[#737597]' : 'bg-[#F2F4F6] focus:bg-white text-[#2E395F]'}`}>
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                                <option value="Draft">Draft</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-2xl border border-[#E6E1DB] shadow-sm">
                                    <h4 className="text-[12px] font-black text-[#2E395F] border-b border-[#E6E1DB] pb-3 mb-6 uppercase tracking-widest">Batch Standard</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Batch Size (Kg)</label>
                                            <div className="relative">
                                                <input 
                                                    disabled={isReadOnly} 
                                                    type="number" 
                                                    list="batchSizes" 
                                                    value={config.rawWeightPerBatch} 
                                                    onChange={e=>setConfig({...config, rawWeightPerBatch: parseFloat(e.target.value)})} 
                                                    className={`w-full border border-[#B2CADE] rounded-xl p-3 text-[12px] font-mono font-bold text-right pr-10 focus:border-[#C22D2E] outline-none transition-all ${isReadOnly ? 'bg-[#F2F4F6] text-[#737597]' : 'bg-[#F2F4F6] focus:bg-white text-[#2E395F]'}`}
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#737597]">KG</span>
                                                <datalist id="batchSizes">
                                                    {STANDARD_BATCH_SIZES.map(s => <option key={s} value={s} />)}
                                                </datalist>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">% Yield Target</label>
                                            <input disabled={isReadOnly} type="number" value={config.yieldPercent} onChange={e=>setConfig({...config, yieldPercent: parseFloat(e.target.value)})} className={`w-full border border-[#B2CADE] rounded-xl p-3 text-[12px] font-mono font-bold text-right focus:border-[#C22D2E] outline-none transition-all text-[#C22D2E] ${isReadOnly ? 'bg-[#F2F4F6]' : 'bg-[#F2F4F6] focus:bg-white'}`} />
                                        </div>
                                        <div className="bg-[#537E72]/10 rounded-xl border border-[#537E72]/20 p-4 flex flex-col justify-center shadow-inner">
                                            <span className="text-[10px] text-[#537E72] uppercase font-black tracking-widest mb-1">Est. Output</span>
                                            <span className="text-2xl font-mono font-black text-[#2E395F]">{(config.rawWeightPerBatch * (config.yieldPercent/100)).toFixed(1)} <span className="text-[12px] text-[#55738D]">KG</span></span>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Spec Pieces/Kg</label>
                                            <input disabled={isReadOnly} type="number" value={config.specPiecesPerKg || 0} onChange={e=>setConfig({...config, specPiecesPerKg: parseFloat(e.target.value)})} className={`w-full border border-[#B2CADE] rounded-xl p-3 text-[12px] font-mono font-bold text-right focus:border-[#C22D2E] outline-none transition-all ${isReadOnly ? 'bg-[#F2F4F6] text-[#737597]' : 'bg-[#F2F4F6] focus:bg-white text-[#2E395F]'}`} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-[#55738D] uppercase tracking-widest block mb-2">Piece Weight (g)</label>
                                            <input disabled={isReadOnly} type="number" value={config.pieceWeightG || 0} onChange={e=>setConfig({...config, pieceWeightG: parseFloat(e.target.value)})} className={`w-full border border-[#B2CADE] rounded-xl p-3 text-[12px] font-mono font-bold text-right focus:border-[#C22D2E] outline-none transition-all ${isReadOnly ? 'bg-[#F2F4F6] text-[#737597]' : 'bg-[#F2F4F6] focus:bg-white text-[#2E395F]'}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'mixing' && (
                            <ConfigTableSection 
                                title="Mixing Process" 
                                isReadOnly={isReadOnly} 
                                dropdownOptions={options} 
                                openMaster={(val: any) => setSettingsMode(val)}
                                headers={[{label:'Machine', key:'machineMixing', gear:true}, {label:'Batter Formula', key:'batterFormulas', gear:true}, {label:'Batch/Cycle', key:'batchPerCycle'}, {label:'Cycle Time (min)', key:'cycleTimeMin'}, {label:'% Yield', key:'yieldPercent'}]}
                                items={config.mixingStandards}
                                fields={[{key:'machine', type:'select', listKey:'machineMixing'}, {key:'batter', type:'select', listKey:'batterFormulas'}, {key:'batchPerCycle', type:'number', align:'text-center'}, {key:'cycleTimeMin', type:'number', align:'text-center'}, {key:'yieldPercent', type:'number', align:'text-right', class:'text-[#C22D2E] font-bold'}]}
                                onAdd={() => addArrayItem('mixingStandards', {machine:'', batter:'', batchPerCycle:1, cycleTimeMin:10, yieldPercent:100})}
                                onRemove={(id: number) => removeArrayItem('mixingStandards', id)}
                                updateArrayItem={(id: number, field: string, val: any) => updateArrayItem('mixingStandards', id, field, val)}
                            />
                        )}
                        {activeTab === 'forming' && (
                            <ConfigTableSection 
                                title="Forming Process" 
                                isReadOnly={isReadOnly} 
                                dropdownOptions={options} 
                                openMaster={(val: any) => setSettingsMode(val)}
                                headers={[{label:'Batter', key:'batterFormulas', gear:true}, {label:'Size', key:'productSizes', gear:true}, {label:'Type', key:'formingTypes', gear:true}, {label:'Casing', key:'casingTypes', gear:true}, {label:'Stuffed', key:'stuffed'}, {label:'Capacity (kg/hr)', key:'capacityKgHr'}]}
                                items={config.formingStandards}
                                fields={[{key:'batter', type:'select', listKey:'batterFormulas'}, {key:'size', type:'select', listKey:'productSizes'}, {key:'type', type:'select', listKey:'formingTypes'}, {key:'casing', type:'select', listKey:'casingTypes'}, {key:'stuffed', type:'boolean', align:'text-center'}, {key:'capacityKgHr', type:'number', align:'text-right'}]}
                                onAdd={() => addArrayItem('formingStandards', {batter:'', size:'', type:'', casing:'', stuffed:false, capacityKgHr:1000})}
                                onRemove={(id: number) => removeArrayItem('formingStandards', id)}
                                updateArrayItem={(id: number, field: string, val: any) => updateArrayItem('formingStandards', id, field, val)}
                            />
                        )}
                        {activeTab === 'cooking' && (
                            <ConfigTableSection 
                                title="Cooking Process" 
                                isReadOnly={isReadOnly} 
                                dropdownOptions={options} 
                                openMaster={(val: any) => setSettingsMode(val)}
                                headers={[{label:'Oven Unit', key:'cookingOvens', gear:true}, {label:'Program', key:'cookingPrograms', gear:true}, {label:'Cycle Time (min)', key:'cycleTimeMin'}, {label:'Capacity (Batch)', key:'capacityBatch'}]}
                                items={config.cookingStandards}
                                fields={[{key:'oven', type:'select', listKey:'cookingOvens'}, {key:'program', type:'select', listKey:'cookingPrograms'}, {key:'cycleTimeMin', type:'number', align:'text-center'}, {key:'capacityBatch', type:'number', align:'text-center'}]}
                                onAdd={() => addArrayItem('cookingStandards', {oven:'', program:'', cycleTimeMin:60, capacityBatch:1})}
                                onRemove={(id: number) => removeArrayItem('cookingStandards', id)}
                                updateArrayItem={(id: number, field: string, val: any) => updateArrayItem('cookingStandards', id, field, val)}
                            />
                        )}
                        {activeTab === 'cooling' && (
                            <ConfigTableSection 
                                title="Cooling Process" 
                                isReadOnly={isReadOnly} 
                                dropdownOptions={options} 
                                openMaster={(val: any) => setSettingsMode(val)}
                                headers={[{label:'Cooling Unit', key:'coolingUnits', gear:true}, {label:'Program', key:'coolingPrograms', gear:true}, {label:'Cycle Time (min)', key:'cycleTimeMin'}, {label:'Capacity (Batch)', key:'capacityBatch'}]}
                                items={config.coolingStandards}
                                fields={[{key:'unit', type:'select', listKey:'coolingUnits'}, {key:'program', type:'select', listKey:'coolingPrograms'}, {key:'cycleTimeMin', type:'number', align:'text-center'}, {key:'capacityBatch', type:'number', align:'text-center'}]}
                                onAdd={() => addArrayItem('coolingStandards', {unit:'', program:'', cycleTimeMin:30, capacityBatch:1})}
                                onRemove={(id: number) => removeArrayItem('coolingStandards', id)}
                                updateArrayItem={(id: number, field: string, val: any) => updateArrayItem('coolingStandards', id, field, val)}
                            />
                        )}
                        {activeTab === 'peeling' && (
                            <ConfigTableSection 
                                title="Peeling Process" 
                                isReadOnly={isReadOnly} 
                                dropdownOptions={options} 
                                openMaster={(val: any) => setSettingsMode(val)}
                                headers={[{label:'Method', key:'peelingMethods', gear:true}, {label:'Capacity (kg/hr)', key:'capacityKgHr'}]}
                                items={config.peelingStandards}
                                fields={[{key:'method', type:'select', listKey:'peelingMethods'}, {key:'capacityKgHr', type:'number', align:'text-right'}]}
                                onAdd={() => addArrayItem('peelingStandards', {method:'', capacityKgHr:500})}
                                onRemove={(id: number) => removeArrayItem('peelingStandards', id)}
                                updateArrayItem={(id: number, field: string, val: any) => updateArrayItem('peelingStandards', id, field, val)}
                            />
                        )}
                        {activeTab === 'cutting' && (
                            <ConfigTableSection 
                                title="Cutting Process" 
                                isReadOnly={isReadOnly} 
                                dropdownOptions={options} 
                                openMaster={(val: any) => setSettingsMode(val)}
                                headers={[{label:'Machine', key:'cuttingMachines', gear:true}, {label:'Blade Type', key:'bladeTypes', gear:true}, {label:'Capacity (kg/hr)', key:'capacityKgHr'}]}
                                items={config.cuttingStandards}
                                fields={[{key:'machine', type:'select', listKey:'cuttingMachines'}, {key:'blade', type:'select', listKey:'bladeTypes'}, {key:'capacityKgHr', type:'number', align:'text-right'}]}
                                onAdd={() => addArrayItem('cuttingStandards', {machine:'', blade:'', capacityKgHr:500})}
                                onRemove={(id: number) => removeArrayItem('cuttingStandards', id)}
                                updateArrayItem={(id: number, field: string, val: any) => updateArrayItem('cuttingStandards', id, field, val)}
                            />
                        )}
                        {activeTab === 'packing' && (
                            <ConfigTableSection 
                                title="Packing Process" 
                                isReadOnly={isReadOnly} 
                                dropdownOptions={options} 
                                openMaster={(val: any) => setSettingsMode(val)}
                                headers={[{label:'Machine', key:'packingMachines', gear:true}, {label:'Pack Size', key:'packSizes', gear:true}, {label:'Format', key:'packFormats', gear:true}, {label:'SFG Size', key:'productSizes', gear:true}, {label:'Capacity (kg/hr)', key:'capacityKgHr'}]}
                                items={config.packingStandards}
                                fields={[{key:'machine', type:'select', listKey:'packingMachines'}, {key:'packSize', type:'select', listKey:'packSizes'}, {key:'format', type:'select', listKey:'packFormats'}, {key:'sfgSize', type:'select', listKey:'productSizes'}, {key:'capacityKgHr', type:'number', align:'text-right'}]}
                                onAdd={() => addArrayItem('packingStandards', {machine:'', packSize:'', format:'', sfgSize:'', capacityKgHr:500})}
                                onRemove={(id: number) => removeArrayItem('packingStandards', id)}
                                updateArrayItem={(id: number, field: string, val: any) => updateArrayItem('packingStandards', id, field, val)}
                            />
                        )}
                        {activeTab === 'variants' && (
                            <ConfigTableSection 
                                title="Pack Variants" 
                                isReadOnly={isReadOnly} 
                                dropdownOptions={options} 
                                openMaster={(val: any) => setSettingsMode(val)}
                                headers={[{label:'Pack Size', key:'packSizes', gear:true}, {label:'Format', key:'packFormats', gear:true}, {label:'Capacity (kg/hr)', key:'capacityKgHr'}]}
                                items={config.packVariants}
                                fields={[{key:'packSize', type:'select', listKey:'packSizes'}, {key:'format', type:'select', listKey:'packFormats'}, {key:'capacityKgHr', type:'number', align:'text-right'}]}
                                onAdd={() => addArrayItem('packVariants', {packSize:'', format:'', capacityKgHr:500})}
                                onRemove={(id: number) => removeArrayItem('packVariants', id)}
                                updateArrayItem={(id: number, field: string, val: any) => updateArrayItem('packVariants', id, field, val)}
                            />
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 bg-white border-t border-[#E6E1DB] flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="px-6 py-2.5 text-[#737597] hover:text-[#2E395F] font-bold text-[10px] uppercase tracking-widest transition-colors">Close</button>
                    {!isReadOnly && (
                        <button onClick={handleSaveClick} className="px-8 py-2.5 bg-[#C22D2E] hover:bg-[#9E2C21] text-white font-black text-[11px] uppercase tracking-widest rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2">
                            <LucideIcon name="save" size={14} /> Save Config
                        </button>
                    )}
                </div>
            </StandardModalWrapper>

            {/* Settings Modal (List Manager) */}
            {settingsMode && (
                <ListManagerModal 
                    title={settingsMode.title} 
                    items={options[settingsMode.key] || []} 
                    onAdd={(val) => handleUpdateOption(settingsMode.key, [...(options[settingsMode.key] || []), val])}
                    onRemove={(val) => handleUpdateOption(settingsMode.key, (options[settingsMode.key] || []).filter((i: any) => i !== val))}
                    onClose={() => setSettingsMode(null)} 
                />
            )}
        </div>
    );
}

// Helper Component for Tables
const ConfigTableSection = ({ title, isReadOnly, dropdownOptions, openMaster, headers, items, fields, onAdd, onRemove, updateArrayItem }: any) => (
    <div className="bg-white p-8 rounded-2xl border border-[#E6E1DB] shadow-sm animate-fadeIn">
        <div className="flex justify-between items-center mb-6 border-b border-[#E6E1DB] pb-3">
            <h4 className="font-black text-[12px] text-[#2E395F] uppercase tracking-widest">{title}</h4>
            {!isReadOnly && <button onClick={onAdd} className="text-[10px] font-black uppercase tracking-widest bg-[#C22D2E] text-white px-4 py-2 rounded-lg hover:bg-[#9E2C21] flex items-center gap-2 shadow-sm transition-colors"><LucideIcon name="plus" size={12}/> Add Step</button>}
        </div>
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left min-w-[700px]">
                <thead className="bg-[#55738D] text-white uppercase tracking-widest text-[10px] font-black">
                    <tr>
                        {headers.map((h: any, i: number) => (
                            <th key={i} className={`py-3 px-4 ${i > 0 ? 'text-center' : ''} whitespace-nowrap`}>
                                <div className={`flex items-center gap-2 ${i > 0 ? 'justify-center' : ''}`}>
                                    {h.label}
                                    {h.gear && !isReadOnly && <button onClick={() => openMaster({ key: h.key, title: h.label })} className="text-white/50 hover:text-[#DCBC1B] transition-colors"><LucideIcon name="settings" size={12} /></button>}
                                </div>
                            </th>
                        ))}
                        {!isReadOnly && <th className="py-3 px-4 text-center w-12"></th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E1DB] text-[12px]">
                    {items.map((item: any, idx: number) => (
                        <tr key={item.id} className="hover:bg-[#F2F4F6]/50 transition-colors">
                            {fields.map((f: any, i: number) => (
                                <td key={i} className={`py-2 px-4 align-middle ${f.align === 'text-center' ? 'text-center' : f.align === 'text-right' ? 'text-right' : 'text-left'}`}>
                                    {isReadOnly ? (
                                        <span className={`font-bold ${f.class || 'text-[#2E395F]'}`}>
                                            {f.type === 'boolean' ? (item[f.key] ? 'Yes' : 'No') : item[f.key]}
                                        </span>
                                    ) : (
                                        f.type === 'select' ? (
                                            <select 
                                                value={item[f.key]} 
                                                onChange={e => updateArrayItem(item.id, f.key, e.target.value)}
                                                className={`w-full bg-[#F2F4F6] border border-[#B2CADE] focus:bg-white rounded-lg px-3 py-1.5 focus:border-[#C22D2E] outline-none font-bold text-[#2E395F] transition-all cursor-pointer ${f.class || ''}`}
                                            >
                                                <option value="">-Select-</option>
                                                {dropdownOptions[f.listKey]?.map((o: string) => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        ) : f.type === 'boolean' ? (
                                             <select 
                                                value={item[f.key]?.toString()} 
                                                onChange={e => updateArrayItem(item.id, f.key, e.target.value === 'true')}
                                                className="w-full bg-[#F2F4F6] border border-[#B2CADE] focus:bg-white rounded-lg px-3 py-1.5 focus:border-[#C22D2E] outline-none text-center font-bold text-[#2E395F] transition-all cursor-pointer"
                                            >
                                                <option value="false">No</option>
                                                <option value="true">Yes</option>
                                            </select>
                                        ) : (
                                            <input 
                                                type={f.type || 'text'} 
                                                value={item[f.key]} 
                                                onChange={e => updateArrayItem(item.id, f.key, f.type === 'number' ? parseFloat(e.target.value) : e.target.value)}
                                                className={`w-full bg-[#F2F4F6] border border-[#B2CADE] focus:bg-white rounded-lg px-3 py-1.5 focus:border-[#C22D2E] outline-none font-bold text-[#2E395F] transition-all ${f.class || ''} ${f.align === 'text-center' ? 'text-center' : f.align === 'text-right' ? 'text-right' : 'text-left'} ${f.type === 'number' ? 'font-mono' : ''}`}
                                            />
                                        )
                                    )}
                                </td>
                            ))}
                            {!isReadOnly && (
                                <td className="py-2 px-4 text-center align-middle">
                                    <button onClick={() => onRemove(item.id)} className="text-[#737597] hover:text-[#C22D2E] p-1.5 bg-gray-50 rounded-lg border border-transparent hover:border-red-100 transition-colors"><LucideIcon name="trash-2" size={14}/></button>
                                </td>
                            )}
                        </tr>
                    ))}
                    {items.length === 0 && <tr><td colSpan={headers.length + 1} className="p-10 text-center text-[#737597] font-bold uppercase tracking-widest text-[10px] opacity-50">No configuration added.</td></tr>}
                </tbody>
            </table>
        </div>
    </div>
);
