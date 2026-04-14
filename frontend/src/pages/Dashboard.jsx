import { useStore } from '../store/useStore';
import { Users, FileText, AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, referrals, patients } = useStore();

  // Simulate a "delayed" case (Pending for more than 20 mins)
  const delayedReferrals = referrals.filter(r => 
    r.status === 'Pending' && (new Date() - new Date(r.createdAt)) > 20 * 60 * 1000
  ).length;

  const stats = [
    { name: 'Active Referrals', value: referrals.filter(r => r.status !== 'Completed').length, icon: FileText, color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800' },
    { name: 'Incoming Today', value: referrals.length, icon: ArrowRight, color: 'text-brand-gold dark:text-brand-gold', bg: 'bg-brand-gold/10 dark:bg-brand-gold/20' },
    { name: 'Delayed Cases', value: delayedReferrals, icon: AlertTriangle, color: 'text-danger', bg: 'bg-danger-light dark:bg-danger/20' },
    { name: 'Registered Patients', value: patients.length, icon: Users, color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">System Intelligence</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Authenticated as <span className="text-accent font-bold">{user?.name}</span> • {user?.facility || 'County HQ'}
          </p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Time</p>
          <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{format(new Date(), 'HH:mm')} <span className="text-xs text-slate-500">EAT</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="glass-card rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1 group">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-xl p-3 ${item.bg} transition-transform group-hover:scale-110`}>
                <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{item.name}</dt>
                  <dd className="text-2xl font-bold text-slate-900 dark:text-slate-100">{item.value}</dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Table */}
        <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden border-none shadow-lg">
          <div className="px-6 py-5 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center border-b border-slate-200/50 dark:border-slate-700/50">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest">Live Dispatch Feed</h3>
            <span className="flex items-center px-3 py-1 bg-success/10 text-[10px] text-success font-bold uppercase tracking-tighter rounded-full border border-success/20">
              <div className="h-1.5 w-1.5 rounded-full bg-success mr-2 animate-pulse"></div>
              Real-time
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200/50 dark:divide-slate-700/50">
              <thead>
                <tr className="bg-slate-50/30 dark:bg-slate-800/30">
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Origin</th>
                  <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {referrals.slice(0, 6).map((referral) => {
                  const patient = patients.find(p => p.id === referral.patientId);
                  const isDelayed = referral.status === 'Pending' && (new Date() - new Date(referral.createdAt)) > 20 * 60 * 1000;
                  
                  return (
                    <tr 
                      key={referral.id} 
                      onClick={() => navigate(`/referrals/${referral.id}`)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">{patient?.name}</td>
                      <td className="px-6 py-5 whitespace-nowrap text-xs text-slate-500 font-medium">{referral.fromFacility}</td>
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        <span className={`status-badge
                          ${referral.status === 'Completed' ? 'bg-success/10 border-success/20 text-success' : 
                            referral.status === 'Rejected' ? 'bg-danger/10 border-danger/20 text-danger' :
                            isDelayed ? 'bg-danger/10 border-danger/20 text-danger animate-pulse' : 
                            referral.status === 'Pending' ? 'bg-warning/10 border-warning/20 text-warning' : 
                            referral.status === 'Dispatch Requested' ? 'bg-brand-gold/10 border-brand-gold/20 text-brand-gold' :
                            referral.status === 'Dispatched' ? 'bg-brand-gold border-brand-gold/20 text-slate-900' :
                            'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-400'}`}>
                          {referral.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right text-[11px] text-slate-400 font-bold uppercase tracking-tighter">
                        {format(new Date(referral.createdAt), 'HH:mm')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-50/30 dark:bg-slate-800/30 border-t border-slate-200/50 dark:border-slate-700/50">
            <button onClick={() => navigate('/referrals')} className="w-full py-3 text-[10px] font-bold uppercase text-accent hover:text-accent-hover tracking-widest transition-all hover:bg-accent/5 rounded-xl">View Operational Log</button>
          </div>
        </div>

        {/* Analytics Mini */}
        <div className="space-y-8">
          <div className="bg-slate-900 dark:bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp size={120} />
            </div>
            <div className="relative z-10">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-6">Traffic Analysis</h4>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[11px] font-bold uppercase mb-2">
                    <span>Clearance Rate</span>
                    <span className="text-success">84%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-success to-emerald-400 h-full w-[84%] rounded-full shadow-[0_0_10px_rgba(5,150,105,0.5)]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-bold uppercase mb-2">
                    <span>Mean Transit Time</span>
                    <span className="text-sky-400">32 Mins</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-sky-500 to-accent h-full w-[65%] rounded-full shadow-[0_0_10px_rgba(2,132,199,0.5)]"></div>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-8 leading-relaxed font-medium">System performance optimized for Kakamega County protocols.</p>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 shadow-lg border-none">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-6 px-2">Security Hub</h4>
            <div className="flex items-center space-x-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-6">
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <Users size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none mb-1 uppercase">Active Session</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Log established 12:45</p>
              </div>
            </div>
            <button className="w-full py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all shadow-lg active:scale-95">Audit Network Trail</button>
          </div>
        </div>
      </div>
    </div>
  );
}
