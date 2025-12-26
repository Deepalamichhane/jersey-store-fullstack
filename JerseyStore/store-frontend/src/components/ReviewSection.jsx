import React from 'react';
import { Star, CheckCircle, MessageSquare, ShieldCheck, TrendingUp } from 'lucide-react';

export default function ReviewSection() {
  return (
    <section className="py-24 px-6 md:px-20 bg-gray-50/50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-[#3C486B] rounded-2xl">
              <MessageSquare className="text-white" size={32} />
            </div>
            <div>
              <h2 className="font-anton text-6xl uppercase italic tracking-tighter text-[#3C486B]">
                Fan Commentary
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Verified Match Reports</p>
            </div>
          </div>
          <button className="h-fit px-8 py-4 border-2 border-[#3C486B] text-[#3C486B] rounded-xl font-anton italic uppercase tracking-widest hover:bg-[#3C486B] hover:text-white transition-all">
            Post a Report
          </button>
        </div>

        {/* SUMMARY SCOREBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* Rating Circle */}
          <div className="bg-[#3C486B] rounded-[2.5rem] p-10 text-white flex flex-col items-center justify-center shadow-xl">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-500 mb-2">Season Avg</span>
            <h3 className="font-anton text-8xl italic leading-none">4.9</h3>
            <div className="flex gap-1 mt-4">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />)}
            </div>
            <p className="mt-4 text-[10px] font-bold opacity-60 uppercase">128 Total Reviews</p>
          </div>

          {/* Fit Analysis Bars */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 flex flex-col justify-center space-y-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} className="text-pink-500" />
              <h3 className="font-anton text-xl uppercase italic tracking-wider text-[#3C486B]">Fit Analysis</h3>
            </div>
            <FitLevel label="Tight Fit" percentage={12} />
            <FitLevel label="True to Size" percentage={82} active />
            <FitLevel label="Oversized" percentage={6} />
          </div>

          {/* Quality Assurance Badge */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center shadow-sm">
            <ShieldCheck size={48} className="text-pink-500 mb-4" />
            <h4 className="font-anton text-lg uppercase text-[#3C486B]">Verified Quality</h4>
            <p className="text-xs text-gray-500 mt-2 font-medium">
              Every review comes from a fan who has completed a purchase at Jersey Arena.
            </p>
          </div>
        </div>

        {/* INDIVIDUAL REVIEW GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ReviewCard 
            name="Ricardo S."
            rating={5}
            comment="The 90s fabric feel is incredible. The name printing is sharp and durable. Absolute legendary quality for any collector."
            kit="Authentic L / Home"
            custom="RONALDO #9"
          />
          <ReviewCard 
            name="Sarah J."
            rating={4}
            comment="The colors are more vibrant in person than on screen! It fits slightly slim, so size up if you prefer a baggy look."
            kit="Stadium M / Away"
            custom="NO CUSTOM"
          />
          <ReviewCard 
            name="Liam O."
            rating={5}
            comment="Fastest delivery I've had for a customized kit. Arrived just in time for the derby. This is now my lucky jersey."
            kit="Retro XL / Third"
            custom="GERRARD #8"
          />
        </div>

        <div className="mt-16 flex justify-center">
            <button className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-pink-500 transition-all">
                Load More Match Reports
            </button>
        </div>
      </div>
    </section>
  );
}

// --- SUB-COMPONENTS ---

function FitLevel({ label, percentage, active }) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] font-black uppercase mb-2 tracking-tighter">
        <span className={active ? "text-[#3C486B]" : "text-gray-400"}>{label}</span>
        <span className={active ? "text-pink-500" : "text-gray-400"}>{percentage}%</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${active ? 'bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.3)]' : 'bg-gray-300'}`} 
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  );
}

function ReviewCard({ name, rating, comment, kit, custom }) {
  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-8 hover:shadow-xl transition-all duration-300 group">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-anton text-[#3C486B] group-hover:bg-pink-500 group-hover:text-white transition-colors">
            {name[0]}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h4 className="font-anton text-sm uppercase text-[#3C486B]">{name}</h4>
              <CheckCircle size={12} className="text-blue-500" />
            </div>
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Verified Kit</span>
          </div>
        </div>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10} className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
          ))}
        </div>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed mb-8 italic">"{comment}"</p>

      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
        <div className="flex flex-col">
          <span className="text-[7px] font-black text-gray-400 uppercase mb-1">Kit Version</span>
          <span className="text-[9px] font-bold text-[#3C486B] uppercase">{kit}</span>
        </div>
        <div className="flex flex-col border-l pl-4">
          <span className="text-[7px] font-black text-gray-400 uppercase mb-1">Customization</span>
          <span className="text-[9px] font-bold text-pink-500 uppercase">{custom}</span>
        </div>
      </div>
    </div>
  );
}