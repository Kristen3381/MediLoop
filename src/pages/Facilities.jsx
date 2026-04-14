import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Search, MapPin, Bed, Activity, Phone, Users, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';

export default function Facilities() {
  const { facilities, user, addToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFacilities = facilities.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuickAction = (facilityName) => {
    if (user?.role === 'Ambulance Staff') {
      addToast(`Emergency transfer request sent to ${facilityName}`);
    } else {
      addToast(`Operational query sent to ${facilityName} triage`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter text-center md:text-left">Facility Network</h1>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1 text-center md:text-left">Kakamega County Level 4/5 & Sub-County Registry</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="relative rounded-sm max-w-md mx-auto md:mx-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-sm py-2.5 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 dark:text-slate-100"
            placeholder="Search facility name or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Responsive Grid: Stacks on mobile, 2 cols on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredFacilities.map((facility) => (
          <div key={facility.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hover:border-accent dark:hover:border-accent transition-all group overflow-hidden">
            <div className="p-5 flex-1 space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start gap-2">
                <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 leading-tight uppercase">
                  {facility.name}
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[8px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                  {facility.type}
                </span>
              </div>
              
              {/* Capacities */}
              <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Distance</p>
                  <div className="flex items-center text-[11px] font-bold text-slate-900 dark:text-slate-200">
                    <MapPin size={12} className="mr-1.5 text-slate-400" />
                    {facility.distance}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Available Beds</p>
                  <div className="flex items-center text-[11px] font-bold text-slate-900 dark:text-slate-200">
                    <Bed size={12} className="mr-1.5 text-slate-400" />
                    {facility.bedsAvailable} Units
                  </div>
                </div>
              </div>

              {/* Personnel Roster - Responsive List */}
              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                  <Users size={10} className="mr-1.5" /> Ordered Personnel
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {facility.personnel?.length > 0 ? (
                    facility.personnel.map((p) => (
                      <span 
                        key={p.id} 
                        className={clsx(
                          "px-2 py-1 text-[9px] font-bold uppercase rounded-sm border transition-colors",
                          p.role === 'Doctor' ? "bg-accent/5 border-accent/20 text-accent" :
                          p.role === 'Nurse' ? "bg-success/5 border-success/20 text-success" :
                          "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
                        )}
                        title={`${p.name} - ${p.role}`}
                      >
                        {p.name.split(' ').slice(-1)}
                      </span>
                    ))
                  ) : (
                    <span className="text-[9px] text-slate-400 italic">No assigned staff registered</span>
                  )}
                </div>
              </div>
            </div>

            {/* Role-Based Actions (Responsiveness to Personnel Type) */}
            <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-2 items-center">
              {user?.role === 'Ambulance Staff' ? (
                <button 
                  onClick={() => handleQuickAction(facility.name)}
                  className="w-full py-2 bg-danger text-white text-[9px] font-black uppercase tracking-widest rounded-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <ShieldAlert size={12} />
                  Emergency Transfer
                </button>
              ) : (
                <button 
                  onClick={() => handleQuickAction(facility.name)}
                  className="w-full py-2 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-sm hover:opacity-90 transition-all"
                >
                  Request Dispatch
                </button>
              )}
              <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none p-2 border border-slate-200 dark:border-slate-700 rounded-sm hover:bg-white dark:hover:bg-slate-800 transition-colors">
                  <Phone size={14} className="text-slate-400 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredFacilities.length === 0 && (
        <div className="py-20 text-center text-xs text-slate-400 dark:text-slate-600 italic uppercase tracking-widest border-2 border-dashed border-slate-100 dark:border-slate-900">
          No matching facilities found in network
        </div>
      )}
    </div>
  );
}
