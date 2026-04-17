export const SHEET_NAMES = { MIXING_EXECUTION: 'MIXING_EXECUTION', MATRIX: 'MATRIX' };
export const THEME = { primary: '#C22D2E', secondary: '#BB8588', accent: '#DCBC1B', success: '#537E72', info: '#55738D' };

export const PROCESS_FLOW = [
    { id: 'mixing', label: 'Mixing', icon: 'chef-hat', duration: 15 },
    { id: 'forming', label: 'Forming', icon: 'component', duration: 15 },
    { id: 'steaming', label: 'Steaming', icon: 'thermometer', duration: 30 },
    { id: 'cooling', label: 'Cooling', icon: 'snowflake', duration: 20 },
    { id: 'peeling', label: 'Peeling', icon: 'layers', duration: 10 },
    { id: 'cutting', label: 'Cutting', icon: 'scissors', duration: 15 } 
];

export const STEP_COLORS: Record<string, string> = {
    mixing: '#55738D', // Default blue-ish
    forming: '#b7a159',
    steaming: '#8b2c3d',
    cooling: '#748ea1',
    peeling: '#a76d5e',
    cutting: '#726a7e'
};

export const BASE_PRODUCTS = [
    { code: 'SFG-SMC-001', name: 'SFG Smoked Sausage (Standard)', type: 'Sausage', stdBatchesPerSet: 6 }, 
    { code: 'SFG-MTB-002', name: 'SFG Pork Meatball Grade A', type: 'Meatball', stdBatchesPerSet: 6 },
    { code: 'SFG-BOL-004', name: 'SFG Chili Bologna Bar', type: 'Bologna', stdBatchesPerSet: 4 },
    { code: 'SFG-CHE-009', name: 'SFG Cheese Sausage Lava', type: 'Sausage', stdBatchesPerSet: 6 },
    { code: 'SFG-CKN-010', name: 'SFG Chicken Jor (Tofu Skin)', type: 'Sausage', stdBatchesPerSet: 6 },
    { code: 'SFG-SND-020', name: 'SFG Sandwich Ham', type: 'Ham', stdBatchesPerSet: 4 }
];

export const MOCK_WAITING_SFG = [
    { id: 'W-001', code: 'SFG-SMC-001', name: 'SFG Smoked Sausage (Standard)', batchSet: 'SET #105', steamingFinish: new Date(Date.now() - 1000 * 60 * 60 * 4.5).toISOString(), cuttingFinish: null, weight: 450, location: 'Cooling Room A' },
    { id: 'W-002', code: 'SFG-BOL-004', name: 'SFG Chili Bologna Bar', batchSet: 'SET #88', steamingFinish: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), cuttingFinish: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(), weight: 300, location: 'Buffer Zone 2' },
    { id: 'W-004', code: 'SFG-SMC-001', name: 'SFG Smoked Sausage (Standard)', batchSet: 'SET #106', steamingFinish: new Date(Date.now() - 1000 * 60 * 60 * 1.2).toISOString(), cuttingFinish: null, weight: 450, location: 'Cooling Room A' },
    { id: 'W-005', code: 'SFG-MTB-002', name: 'SFG Pork Meatball Grade A', batchSet: 'SET #112', steamingFinish: new Date(Date.now() - 1000 * 60 * 45).toISOString(), cuttingFinish: null, weight: 500, location: 'Cooling Room B' },
];

export const MOCK_BATCHES = [
    { id: 'SMC-8821', jobId: '260215-010', name: 'SFG Smoked Sausage (Standard)', step: 'mixing', status: 'Processing', timeLeft: 300, startTime: '08:00', setNo: 1 },
    { id: 'SMC-8822', jobId: '260215-010', name: 'SFG Smoked Sausage (Standard)', step: 'mixing', status: 'Processing', timeLeft: 300, startTime: '08:00', setNo: 1 },
    { id: 'CHE-9901', jobId: '260215-003', name: 'SFG Cheese Sausage Lava', step: 'forming', status: 'Processing', timeLeft: 600, startTime: '09:00', setNo: 2 },
    { id: 'SND-7701', jobId: '260215-001', name: 'SFG Sandwich Ham', step: 'steaming', status: 'Waiting', timeLeft: 900, startTime: '07:30', setNo: 3 }
];
