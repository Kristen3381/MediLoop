import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Bell, LogOut, Sun, Moon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Header() {
  const { user, notifications, markNotificationsRead, logout, isDark, toggleTheme } = useStore();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
    if (unreadCount > 0) markNotificationsRead();
  };

  return (
    <header className="glass-header h-20 flex items-center justify-between px-8 transition-all">
      <div className="flex-1 md:pl-0 pl-12">
        <div className="hidden md:block">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Authenticated Session</p>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">
            Terminal Access: <span className="text-brand-gold">{user?.name || 'Authorized Staff'}</span>
          </h2>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all active:scale-95"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={handleNotificationsClick}
            className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative transition-all active:scale-95"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-danger ring-4 ring-white dark:ring-slate-900 animate-pulse"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-4 w-80 glass-card rounded-xl shadow-2xl py-0 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-5 py-3 text-[10px] font-bold text-slate-900 dark:text-slate-100 uppercase bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-700/50">
                Hub Dispatch Alerts
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div key={n.id} className="px-5 py-4 text-xs text-slate-600 dark:text-slate-400 border-b border-slate-100/50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <p className="font-semibold leading-relaxed">{n.message}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-bold uppercase tracking-wider">
                        {formatDistanceToNow(new Date(n.time), { addSuffix: true })}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="px-8 py-10 text-xs text-slate-400 dark:text-slate-500 italic text-center">No active dispatches</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4 border-l border-slate-200 dark:border-slate-800 pl-6 ml-3">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100 uppercase leading-none mb-1">{user?.name}</span>
            <span className="text-[9px] text-brand-gold font-bold uppercase tracking-[0.2em]">{user?.role}</span>
          </div>
          <button 
            onClick={handleLogout} 
            className="p-2.5 text-slate-400 hover:text-danger dark:text-slate-500 dark:hover:text-danger hover:bg-danger/10 rounded-lg transition-all active:scale-95 group"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
}
