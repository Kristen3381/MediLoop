import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, STAFF } from '../store/useStore';

export default function Login() {
  const [email, setEmail] = useState('staff.kakamega@health.go.ke');
  const [password, setPassword] = useState('password123');
  const navigate = useNavigate();
  const login = useStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-[0.1em] mb-1">Employee ID / Email</label>
        <div className="mt-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="block w-full text-xs font-bold border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-sm py-2.5 px-3 focus:outline-none focus:border-slate-500 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-[0.1em] mb-1">System Password</label>
        <div className="mt-1">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="block w-full text-xs font-bold border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-sm py-2.5 px-3 focus:outline-none focus:border-slate-500 transition-colors"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="w-full py-3 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:opacity-90 transition-all shadow-xl"
        >
          Authorize Access
        </button>
      </div>
      
      <p className="text-center text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-4">
        Official Government Use Only • IP Logged
      </p>
    </form>
  );
}
