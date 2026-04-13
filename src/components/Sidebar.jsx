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

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Patient Registry', path: '/patients', icon: Users },
    { name: 'Referral Loop', path: '/referrals', icon: FileText },
    { name: 'Facility Network', path: '/facilities', icon: Building2 },
  ];

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
        "fixed inset-y-0 left-0 z-10 w-64 bg-slate-900 text-slate-100 transition-transform duration-300 ease-in-out md:translate-x-0 md:static border-r border-slate-800",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 border-b border-slate-800 px-6 space-x-3">
            <div className="h-8 w-8 bg-accent rounded-sm flex items-center justify-center">
              <ShieldCheck className="text-white" size={20} />
            </div>
            <span className="text-lg font-black tracking-tighter uppercase">AfyaLink</span>
          </div>
          
          <div className="px-4 py-4 flex items-center space-x-3 bg-slate-800/50 mx-2 mt-4 rounded-sm border border-slate-800">
            <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">
              {user?.name?.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] font-black uppercase truncate leading-none mb-1">{user?.name}</p>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest truncate">{user?.role}</p>
            </div>
          </div>

          <nav className="mt-6 px-2 space-y-1 flex-1">
            <p className="px-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2">Main Navigation</p>
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all",
                    isActive 
                      ? "bg-slate-800 text-white border-l-4 border-accent shadow-lg" 
                      : "text-slate-500 hover:bg-slate-800 hover:text-slate-200"
                  )
                }
              >
                <item.icon className="mr-3" size={16} />
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <div className="bg-slate-800/30 rounded-sm p-3 border border-slate-800/50">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mb-1">System Health</p>
              <div className="flex items-center text-[10px] text-success font-black uppercase">
                <div className="h-1.5 w-1.5 rounded-full bg-success mr-2 animate-pulse"></div>
                Connected to Kakamega Hub
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
