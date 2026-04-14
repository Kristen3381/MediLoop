import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Building2, 
  BarChart3,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar() {
  const { user } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const isAmbulance = user?.role === 'Ambulance Staff';

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Patient Registry', path: '/patients', icon: Users },
  ];

  if (!isAmbulance) {
    navItems.push({ name: 'Referral Loop', path: '/referrals', icon: FileText });
  } else {
    navItems.push({ name: 'Dispatch Comms', path: '/referrals', icon: FileText });
  }

  navItems.push({ name: 'Facility Network', path: '/facilities', icon: Building2 });

  if (user?.role === 'Admin') {
    navItems.push({ name: 'System Intelligence', path: '/analytics', icon: BarChart3 });
  }

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden fixed top-0 left-0 z-20 p-4">
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-500 dark:text-slate-400 hover:text-slate-700 bg-white dark:bg-slate-900 p-2 rounded-sm shadow-md border border-slate-200 dark:border-slate-800">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={clsx(
        "fixed inset-y-0 left-0 z-10 w-64 bg-slate-900 text-slate-100 transition-all duration-300 ease-in-out md:translate-x-0 md:static border-r border-slate-800/50 shadow-2xl md:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full bg-[#0f172a]">
          <div className="flex items-center h-20 border-b border-slate-800/50 px-6 space-x-3">
            <div className="h-9 w-9 bg-brand-gold rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
              <ShieldCheck className="text-white" size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">AfyaLink</span>
          </div>
          
          <div className="px-4 py-6">
            <div className="p-4 flex items-center space-x-3 bg-white/5 mx-2 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-default">
              <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold ring-2 ring-brand-gold/30 ring-offset-2 ring-offset-slate-900">
                {user?.name?.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold truncate leading-none mb-1 text-slate-100">{user?.name}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">{user?.role}</p>
              </div>
            </div>
          </div>

          <nav className="px-3 space-y-1.5 flex-1">
            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Core Services</p>
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center px-4 py-3 text-[11px] font-bold uppercase tracking-wider transition-all rounded-lg group",
                    isActive 
                      ? "bg-brand-gold text-slate-900 shadow-lg shadow-amber-500/20" 
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                  )
                }
              >
                <item.icon className={clsx("mr-3 transition-transform group-hover:scale-110", "h-[18px] w-[18px]")} />
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="p-6 border-t border-slate-800/50">
            <div className="bg-slate-800/20 rounded-xl p-4 border border-slate-800/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-2 -mr-2 h-16 w-16 bg-success/10 rounded-full blur-2xl group-hover:bg-success/20 transition-all"></div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Connectivity</p>
              <div className="flex items-center text-[11px] text-success font-bold">
                <div className="relative flex h-2 w-2 mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                </div>
                Live Hub Sync
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
