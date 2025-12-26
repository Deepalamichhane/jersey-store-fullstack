import { ShieldCheck, Truck, RefreshCcw, Award } from 'lucide-react';

export default function GuaranteeBar() {
  const benefits = [
    { icon: <Award />, title: "Premium Fabric", desc: "Authentic kit feel" },
    { icon: <Truck />, title: "Fast Delivery", desc: "Tracked worldwide" },
    { icon: <RefreshCcw />, title: "Easy Returns", desc: "30-day window" },
    { icon: <ShieldCheck />, title: "Secure Pay", desc: "SSL Encrypted" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-gray-100 bg-white px-6">
      {benefits.map((item, i) => (
        <div key={i} className="flex flex-col items-center text-center group">
          <div className="mb-4 p-3 bg-stadium-gray rounded-2xl text-jersey-pink group-hover:bg-jersey-pink group-hover:text-white transition-all duration-300">
            {item.icon}
          </div>
          <h4 className="text-[10px] font-black uppercase tracking-widest">{item.title}</h4>
          <p className="text-xs text-slate-muted mt-1 italic">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}