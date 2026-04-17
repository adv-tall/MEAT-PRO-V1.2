import React from 'react';
import { DraggableModal } from '../../../components/shared/DraggableModal';

export const QrCodeModal = ({ isOpen, onClose, data }: any) => {
    if (!isOpen || !data) return null;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BATCH:${data.items[0].id}`;
    
    return (
        <DraggableModal
            isOpen={isOpen}
            onClose={onClose}
            title="Scan to Operate"
            width="max-w-sm"
        >
            <div className="p-8 text-center bg-[#F2F4F6] flex-1">
                <p className="text-[11px] text-[#737597] font-bold uppercase tracking-widest mb-6">Use mobile device to scan this code</p>
                <div className="bg-white p-4 rounded-xl border border-[#B2CADE] inline-block mb-6 shadow-sm">
                    <img src={qrUrl} alt="QR Code" className="w-48 h-48 mix-blend-multiply" />
                </div>
                <div className="text-left bg-white p-4 rounded-xl text-[12px] border border-[#E6E1DB] shadow-sm">
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#E6E1DB]">
                        <span className="text-[#737597] font-bold uppercase tracking-widest text-[10px]">Set No</span>
                        <span className="font-black text-[#2E395F] font-mono text-sm">{data.setNo}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#E6E1DB]">
                        <span className="text-[#737597] font-bold uppercase tracking-widest text-[10px]">Product</span>
                        <span className="font-bold text-[#2E395F] truncate max-w-[150px]">{data.productName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[#737597] font-bold uppercase tracking-widest text-[10px]">Batches</span>
                        <span className="font-black text-[#C22D2E] font-mono text-sm">{data.items.length}</span>
                    </div>
                </div>
            </div>
            <div className="p-4 bg-white border-t border-[#E6E1DB] flex justify-end">
                <button onClick={onClose} className="px-6 py-2 bg-[#2E395F] hover:bg-[#141619] text-white rounded-lg text-[11px] font-black uppercase tracking-widest transition-colors shadow-sm w-full">Close</button>
            </div>
        </DraggableModal>
    );
};
