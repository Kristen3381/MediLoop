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
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-6 z-10 transition-colors">
      <div className="flex-1 md:pl-0 pl-12">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight hidden md:block">
          Welcome, {user?.name || 'Authorized Staff'}
        </h2>
      </div>

      <div className="flex items-center space-x-2">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm transition-colors"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={handleNotificationsClick}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm relative transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-danger ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-sm shadow-2xl py-0 z-20 border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="px-4 py-2 text-[10px] font-bold text-slate-900 dark:text-slate-100 uppercase bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                System Notifications
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div key={n.id} className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <p className="font-medium">{n.message}</p>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">
                        {formatDistanceToNow(new Date(n.time), { addSuffix: true })}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500 italic text-center">No system alerts</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-800 pl-4 ml-2">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase">{user?.name}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest">{user?.role}</span>
          </div>
          <button 
            onClick={handleLogout} 
            className="p-2 text-slate-400 hover:text-danger dark:text-slate-500 dark:hover:text-danger hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
