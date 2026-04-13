import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter">AfyaLink</h1>
          <p className="mt-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            Kakamega County Health Services
          </p>
          <div className="mt-4 inline-block px-3 py-1 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-xl">
            Official Portal
          </div>
        </div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 border border-slate-200 dark:border-slate-800 shadow-2xl sm:px-10 rounded-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
