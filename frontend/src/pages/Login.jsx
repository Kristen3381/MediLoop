import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, STAFF } from '../store/useStore';

export default function Login() {
  const [role, setRole] = useState('Doctor');
  const navigate = useNavigate();
  const login = useStore((state) => state.login);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Default to a staff name from the list
    let staffName = '';
    if (role === 'Doctor') staffName = STAFF.DOCTORS[1].name; // Dr. Mercy Akinyi
    else if (role === 'Nurse') staffName = STAFF.NURSES[0].name; // Nurse Faith Atieno
    else if (role === 'Admin') staffName = STAFF.ADMINS[0].name; // Admin Ruth Wafula
    else staffName = STAFF.EMTS[0].name; // EMT Joseph Shikuku

    login({
      id: 'usr-1',
      name: staffName,
      role: role,
      facility: role === 'Doctor' ? 'Kakamega County General Hospital (Level 5)' : 'Malava Sub-County Hospital'
    });
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="role" className="block text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-[0.1em] mb-1">
          System Access Role
        </label>
        <div className="mt-1">
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="block w-full text-xs font-bold border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-sm py-2.5 px-3 focus:outline-none focus:border-slate-500 transition-colors"
          >
            <option>Doctor</option>
            <option>Nurse</option>
            <option>Admin</option>
            <option>Ambulance Staff</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-[0.1em] mb-1">Employee ID / Email</label>
        <div className="mt-1">
          <input
            type="text"
            defaultValue="staff.kakamega@health.go.ke"
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
            defaultValue="password123"
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
