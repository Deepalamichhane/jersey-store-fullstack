import React from 'react';
import { X, Ruler, Info, ChevronRight } from 'lucide-react';

export default function SizeGuideModal({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  const sizes = [
    { size: 'S', chest: '35-37"', waist: '29-31"', length: '28"' },
    { size: 'M', chest: '38-40"', waist: '32-34"', length: '29"' },
    { size: 'L', chest: '41-43"', waist: '35-37"', length: '30"' },
    { size: 'XL', chest: '44-46"', waist: '38-40"', length: '31"' },
    { size: '2XL', chest: '47-49"', waist: '41-43"', length: '32"' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-pitch-black/40 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-gray-100">
        
        {/* Header */}
        <div className="p-10 pb-6 flex justify-between items-start">
          <div>
            <h2 className="font-anton text-4xl uppercase italic leading-none tracking-tighter text-pitch-black">Size Guide</h2>
            <p className="text-jersey-pink text-[9px] mt-2 font-black uppercase tracking-[0.3em]">Find your match-day fit</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-pitch-black"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-10 pb-10">
          {/* Fit Alert - Simplified */}
          <div className="bg-stadium-gray/50 p-5 rounded-2xl flex gap-4 mb-8 items-center border border-gray-100">
            <Info className="text-pitch-black shrink-0" size={18} />
            <p className="text-[11px] text-gray-500 leading-relaxed italic font-medium">
              Authentic Kits are <span className="text-pitch-black font-bold">athletic slim fit</span>. We recommend sizing up if you prefer a looser feel.
            </p>
          </div>

          {/* Table */}
          <div className="overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Size</th>
                  <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Chest</th>
                  <th className="pb-4 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sizes.map((row) => (
                  <tr 
                    key={row.size} 
                    onClick={() => {
                        onSelect(row.size);
                        onClose();
                    }}
                    className="group cursor-pointer hover:bg-gray-50 transition-all"
                  >
                    <td className="py-5 font-anton text-xl italic text-pitch-black">{row.size}</td>
                    <td className="py-5 text-sm text-gray-500 font-medium italic">{row.chest}</td>
                    <td className="py-5 text-right">
                        <div className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-300 group-hover:text-jersey-pink transition-colors">
                            Select <ChevronRight size={12} />
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Measures */}
          <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between gap-6">
            <div className="flex flex-col gap-1">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-pitch-black">Chest</h4>
              <p className="text-[8px] text-gray-400 leading-tight uppercase font-bold">Measure horizontal fullest part</p>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-pitch-black">Fast Delivery</h4>
              <p className="text-[8px] text-gray-400 leading-tight uppercase font-bold">2-4 Days Express Shipping</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}