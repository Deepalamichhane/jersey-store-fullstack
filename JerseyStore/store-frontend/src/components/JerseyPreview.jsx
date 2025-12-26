import React from 'react';

export default function JerseyPreview({ name, number }) {
  // Logic to handle very long names by shrinking font size
  const getNameSize = (text) => {
    const length = text?.length || 0;
    if (length > 10) return 'text-xl md:text-2xl';
    if (length > 8) return 'text-2xl md:text-3xl';
    return 'text-3xl md:text-4xl'; // Slightly smaller to match the new scale
  };

  return (
    <div className="relative w-full max-w-sm aspect-[3/4] bg-white rounded-[3rem] p-10 flex flex-col items-center justify-center shadow-xl border border-gray-100 overflow-hidden group transition-all duration-500 hover:shadow-2xl">
      
      {/* 1. Subtle Lighting Effect (Pink Glow) */}
      <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-jersey-pink/5 to-transparent pointer-events-none"></div>
      
      {/* 2. Jersey Back Content */}
      <div className="flex flex-col items-center w-full z-10">
        
        {/* Name on Back: Dynamic Sizing & Arched Feel */}
        <div className="h-16 flex items-center justify-center w-full mb-2">
          <h2 className={`${getNameSize(name)} font-anton text-pitch-black uppercase tracking-[0.25em] text-center drop-shadow-sm transition-all duration-300 transform group-hover:-translate-y-1`}>
            {name || "NAME"}
          </h2>
        </div>
        
        {/* Massive Jersey Pink Number */}
        <div className="h-56 flex items-center justify-center relative">
          {/* Subtle Glow behind number */}
          <div className="absolute inset-0 bg-jersey-pink/10 blur-[60px] rounded-full scale-75 group-hover:scale-110 transition-transform duration-700"></div>
          
          <span className="font-anton text-[160px] md:text-[190px] leading-none text-pitch-black drop-shadow-[0_8px_20px_rgba(0,0,0,0.1)] select-none transition-all duration-700 group-hover:scale-105 italic group-hover:text-jersey-pink relative z-10">
            {number || "10"}
          </span>
        </div>
      </div>

      {/* 3. Bottom Authentication Label */}
      <div className="mt-6 z-10">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-1 w-1 rounded-full bg-jersey-pink/30"></div>
            ))}
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400">
             Match-Day Spec
          </span>
        </div>
      </div>

      {/* 4. Textures for Fabric Feel (Lighter/Clean) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      {/* Interior "Stitch" lines */}
      <div className="absolute left-10 top-0 bottom-0 w-[1px] bg-gray-50"></div>
      <div className="absolute right-10 top-0 bottom-0 w-[1px] bg-gray-50"></div>
    </div>
  );
}