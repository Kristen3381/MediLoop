import { Outlet } from 'react-router-dom';
import { Shield, Activity } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-sky-500 to-indigo-600"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl mb-6 border border-slate-100 dark:border-slate-800 animate-in zoom-in duration-500">
            <Activity className="h-8 w-8 text-accent animate-pulse" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter mb-2">
            Afya<span className="text-accent">Link</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] mb-8">
            Kakamega Health Dispatch Network
          </p>
        </div>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl py-10 px-4 border border-white dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-none sm:px-12 rounded-3xl transition-all">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
              <Shield size={12} className="text-slate-500" />
              <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Secure Node Authentication</span>
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">Loop Access Authorization</h2>
          </div>
          <Outlet />
        </div>
        
        <div className="mt-8 flex justify-center items-center space-x-6">
          <div className="flex flex-col items-center">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">System Health</p>
            <div className="flex items-center space-x-1">
              <div className="h-1 w-1 rounded-full bg-success"></div>
              <span className="text-[9px] font-bold text-success uppercase">Operational</span>
            </div>
          </div>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>
          <div className="flex flex-col items-center">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Protocol Version</p>
            <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase">v2.4.0-Stable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
