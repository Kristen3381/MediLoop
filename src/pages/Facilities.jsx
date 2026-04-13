import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Search, MapPin, Bed, Activity, Phone } from 'lucide-react';

export default function Facilities() {
  const { facilities } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFacilities = facilities.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter">Facility Network</h1>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Kakamega County Level 4/5 & Sub-County Registry</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="relative rounded-sm max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-sm py-2 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 dark:text-slate-100"
            placeholder="Search facility name or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((facility) => (
          <div key={facility.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hover:border-accent dark:hover:border-accent transition-all group">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 leading-tight pr-2 uppercase">
                  {facility.name}
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[8px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                  {facility.type}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-[11px] text-slate-600 dark:text-slate-400">
                  <MapPin size={14} className="mr-2 text-slate-400 group-hover:text-accent transition-colors" />
                  Distance: <span className="ml-1 font-bold text-slate-900 dark:text-slate-200">{facility.distance}</span>
                </div>
                
                <div className="flex items-center text-[11px] text-slate-600 dark:text-slate-400">
                  <Bed size={14} className="mr-2 text-slate-400 group-hover:text-accent transition-colors" />
                  General Ward: <span className="ml-1 font-bold text-slate-900 dark:text-slate-200">{facility.bedsAvailable} Beds Available</span>
                </div>

                <div className="flex items-center text-[11px] text-slate-600 dark:text-slate-400">
                  <Activity size={14} className="mr-2 text-slate-400 group-hover:text-accent transition-colors" />
                  ICU Capacity: 
                  <span className={`ml-1 font-bold ${facility.icuAvailable === 0 ? 'text-danger animate-pulse' : 'text-slate-900 dark:text-slate-200'}`}>
                    {facility.icuAvailable} Units
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <button className="text-accent text-[10px] font-black uppercase hover:underline tracking-widest">
                Operational Status
              </button>
              <Phone size={14} className="text-slate-400 cursor-pointer hover:text-accent transition-colors" />
            </div>
          </div>
        ))}
      </div>
      
      {filteredFacilities.length === 0 && (
        <div className="py-20 text-center text-xs text-slate-400 dark:text-slate-600 italic uppercase tracking-widest">No matching facilities found</div>
      )}
    </div>
  );
}
