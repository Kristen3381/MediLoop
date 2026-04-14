import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('staff.kakamega@health.go.ke');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const login = useStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-bottom-2 duration-700">
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Terminal ID / Email</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-accent transition-colors">
              <Mail size={16} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@health.go.ke"
              className="block w-full pl-11 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 dark:text-white rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-slate-400 placeholder:font-normal"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Security Access Key</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-accent transition-colors">
              <Lock size={16} />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="block w-full pl-11 text-xs font-bold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 dark:text-white rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-slate-400 placeholder:font-normal"
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-800 dark:hover:bg-white transition-all shadow-xl shadow-slate-200 dark:shadow-none active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Verifying Registry...</span>
            </>
          ) : (
            <>
              <LogIn size={16} />
              <span>Authorize Access</span>
            </>
          )}
        </button>
      </div>
      
      <div className="flex flex-col items-center space-y-4 mt-8">
        <div className="h-px w-12 bg-slate-100 dark:bg-slate-800"></div>
        <p className="text-center text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[200px]">
          System monitored for <span className="text-danger">unauthorized access</span> attempts.
        </p>
      </div>
    </form>
  );
}
