export const CATEGORIES = ['All', 'Batter', 'SFG', 'FG', 'Sausage', 'Meatball', 'Bologna', 'Ham', 'Sliced', 'Loaf', 'NPD'];
export const BRANDS = ['AFM', 'ARO', 'CP', 'BKP', 'SAVE', 'CJ', 'Mungmee', 'Generic', 'No Brand', 'Internal', 'Makro (OEM)', 'Test'];

export const generateFullMasterItems = () => {
    const items: any[] = [];
    const todayStr = new Date().toLocaleDateString('en-GB');
    const rawData = [
        // Batters
        { sku: 'BAT-001', name: 'เนื้อไส้กรอกไก่ Standard', type: 'Batter', cat: 'Batter', brand: '', w: 0, pieces: 0 },
        { sku: 'BAT-002', name: 'เนื้อไส้กรอกไก่พริกไทยดำ', type: 'Batter', cat: 'Batter', brand: '', w: 0, pieces: 0 },
        { sku: 'BAT-003', name: 'เนื้อลูกชิ้นไก่ Grade A', type: 'Batter', cat: 'Batter', brand: '', w: 0, pieces: 0 },
        { sku: 'BAT-005', name: 'เนื้อโบโลน่าไก่พริก', type: 'Batter', cat: 'Batter', brand: '', w: 0, pieces: 0 },
        
        // SFGs
        { sku: 'SFG-001', name: 'ไส้กรอกไก่รมควัน 6 นิ้ว (จัมโบ้)', type: 'SFG', cat: 'SFG', brand: '', w: 0, pieces: 0 },
        { sku: 'SFG-002', name: 'ไส้กรอกไก่คอกเทล 4 นิ้ว', type: 'SFG', cat: 'SFG', brand: '', w: 0, pieces: 0 },
        { sku: 'SFG-006', name: 'โบโลน่าไก่พริก (แท่งยาว)', type: 'SFG', cat: 'SFG', brand: '', w: 0, pieces: 0 },
        
        // FGs
        { sku: 'FG-1001', name: 'ไส้กรอกไก่จัมโบ้ ARO 1kg', type: 'FG', cat: 'Sausage', brand: 'ARO', w: 1000, pieces: 20, status: 'Active', updated: '01/02/2026' },
        { sku: 'FG-1002', name: 'ไส้กรอกไก่จัมโบ้ CP 500g', type: 'FG', cat: 'Sausage', brand: 'CP', w: 500, pieces: 10, status: 'Active', updated: '15/01/2026' },
        { sku: 'FG-1003', name: 'ไส้กรอกไก่จัมโบ้ (ถุงใส)', type: 'FG', cat: 'Sausage', brand: 'No Brand', w: 5000, pieces: 100, status: 'Active', updated: '20/01/2026' },
        { sku: 'FG-2001', name: 'ไส้กรอกคอกเทล ARO 1kg', type: 'FG', cat: 'Sausage', brand: 'ARO', w: 1000, pieces: 80, status: 'Active', updated: '01/02/2026' },
        { sku: 'FG-2002', name: 'ไส้กรอกคอกเทล BKP 500g', type: 'FG', cat: 'Sausage', brand: 'BKP', w: 500, pieces: 40, status: 'Active', updated: '10/01/2026' },
        { sku: 'FG-3001', name: 'ลูกชิ้นหมู ARO 1kg', type: 'FG', cat: 'Meatball', brand: 'ARO', w: 1000, pieces: 100, status: 'Active', updated: '05/02/2026' },
        { sku: 'FG-3002', name: 'ลูกชิ้นหมู SAVE 500g', type: 'FG', cat: 'Meatball', brand: 'SAVE', w: 500, pieces: 50, status: 'Active', updated: '05/02/2026' },
        { sku: 'FG-3005', name: 'ลูกชิ้นปลาเยาวราช 500g', type: 'FG', cat: 'Meatball', brand: 'Generic', w: 500, pieces: 45, status: 'Inactive', updated: '12/12/2025' },
        { sku: 'FG-3010', name: 'ลูกชิ้นหมูปิ้ง (แพ็ค 10 ไม้)', type: 'FG', cat: 'Meatball', brand: 'Mungmee', w: 800, pieces: 10, status: 'Active', updated: '02/02/2026' },
        { sku: 'FG-4001', name: 'โบโลน่าพริก CP 1kg (Sliced)', type: 'FG', cat: 'Bologna', brand: 'CP', w: 1000, pieces: 50, status: 'Active', updated: '28/01/2026' },
        { sku: 'FG-4002', name: 'โบโลน่าพริก BKP 200g (Sliced)', type: 'FG', cat: 'Bologna', brand: 'BKP', w: 200, pieces: 10, status: 'Active', updated: '28/01/2026' },
        { sku: 'FG-4005', name: 'แซนวิชแฮม 500g (Sliced)', type: 'FG', cat: 'Ham', brand: 'ARO', w: 500, pieces: 25, status: 'Active', updated: '18/01/2026' },
        { sku: 'FG-5001', name: 'ไก่ยอแผ่น 500g (Sliced)', type: 'FG', cat: 'Sliced', brand: 'Mungmee', w: 500, pieces: 15, status: 'Active', updated: '03/02/2026' },
        { sku: 'FG-5002', name: 'ไก่ยอแผ่น 1kg (Whole)', type: 'FG', cat: 'Loaf', brand: 'Mungmee', w: 1000, pieces: 1, status: 'Active', updated: '03/02/2026' },
        { sku: 'FG-NEW-01', name: 'สินค้าใหม่ทดสอบ 1kg', type: 'FG', cat: 'NPD', brand: 'Test', w: 1000, pieces: 0, status: 'Draft', updated: 'Today' },
        { sku: 'FG-6001', name: 'ไส้กรอกแฟรงค์ไก่หนังกรอบ 6 นิ้ว', type: 'FG', cat: 'Sausage', brand: 'BKP', w: 1000, pieces: 25, status: 'Inactive', updated: '20/12/2025' },
        { sku: 'FG-6002', name: 'โบโลน่าพริก 200g (แบบกลม)', type: 'FG', cat: 'Bologna', brand: 'CP', w: 200, pieces: 12, status: 'Inactive', updated: '15/12/2025' },
        { sku: 'FG-7001', name: 'ไก่ยอแท่งยาว 2.5kg (สำหรับร้านอาหาร)', type: 'FG', cat: 'Loaf', brand: 'Mungmee', w: 2500, pieces: 1, status: 'Active', updated: '06/02/2026' },
        { sku: 'FG-7002', name: 'หมูยอพริกไทยดำ 500g', type: 'FG', cat: 'Loaf', brand: 'Mungmee', w: 500, pieces: 1, status: 'Active', updated: '06/02/2026' },
        { sku: 'FG-8001', name: 'สโมคแฮม 1kg (ตัดเต๋า)', type: 'FG', cat: 'Ham', brand: 'ARO', w: 1000, pieces: 1, status: 'Active', updated: '04/02/2026' },
        { sku: 'FG-8002', name: 'แฮมหมูรมควัน 200g (แพ็คสูญญากาศ)', type: 'FG', cat: 'Ham', brand: 'CP', w: 200, pieces: 8, status: 'Draft', updated: 'Yesterday' },
        { sku: 'FG-9001', name: 'ลูกชิ้นเอ็นเนื้อ 500g', type: 'FG', cat: 'Meatball', brand: 'Generic', w: 500, pieces: 40, status: 'Inactive', updated: '10/11/2025' },
        { sku: 'FG-9002', name: 'ลูกชิ้นสาหร่าย 500g', type: 'FG', cat: 'Meatball', brand: 'Generic', w: 500, pieces: 35, status: 'Active', updated: '01/02/2026' },
        // Add new AFM items
        { sku: 'FG-AFM-01', name: 'ไส้กรอกไก่ AFM 1kg', type: 'FG', cat: 'Sausage', brand: 'AFM', w: 1000, pieces: 20, status: 'Active', updated: '10/02/2026' },
        { sku: 'FG-AFM-02', name: 'โบโลน่า AFM 500g', type: 'FG', cat: 'Bologna', brand: 'AFM', w: 500, pieces: 25, status: 'Active', updated: '10/02/2026' },
        { sku: 'FG-CJ-01', name: 'ลูกชิ้นหมู CJ 500g', type: 'FG', cat: 'Meatball', brand: 'CJ', w: 500, pieces: 50, status: 'Active', updated: '11/02/2026' }
    ];
    rawData.forEach((item, index) => {
        items.push({ id: `item-${index}`, status: item.status || 'Active', updated: item.updated || todayStr, ...item });
    });
    return items;
};

export const getMockHistory = () => [
    { date: '01/02/2026 14:30', user: 'Admin', action: 'Update', detail: 'Changed status to Active' },
    { date: '28/01/2026 09:15', user: 'Prod. Manager', action: 'Update', detail: 'Adjusted size configurations' },
    { date: '10/01/2026 11:00', user: 'Admin', action: 'Create', detail: 'Initial creation of item' },
];

export const getCategoryStyle = (category: string) => {
    switch (category?.toUpperCase()) {
        case 'SAUSAGE': return 'bg-white text-[#C22D2E] border-[#C22D2E]/30';
        case 'MEATBALL': return 'bg-white text-[#55738D] border-[#55738D]/30';
        case 'BOLOGNA': return 'bg-white text-[#BB8588] border-[#BB8588]/30';
        case 'HAM': return 'bg-white text-[#B06821] border-[#D8A48F]/30';
        case 'SLICED': return 'bg-white text-[#537E72] border-[#537E72]/30';
        case 'LOAF': return 'bg-white text-[#B06821] border-[#DCBC1B]/30';
        case 'NPD': return 'bg-white text-[#616852] border-[#DCBC1B]/30';
        default: return 'bg-white text-[#737597] border-[#E6E1DB]';
    }
};

export const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
        case 'ACTIVE': return 'bg-white text-[#3A7283] border-[#3A7283] font-black';
        case 'INACTIVE': return 'bg-white text-[#94A3B8] border-[#94A3B8] font-black';
        case 'DRAFT': return 'bg-white text-[#B06821] border-[#B06821] font-black';
        default: return 'bg-white text-gray-400 border-gray-300 font-bold';
    }
};

export const kebabToPascal = (str: string) => str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
