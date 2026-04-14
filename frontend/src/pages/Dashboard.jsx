import { useStore } from '../store/useStore';
import { Users, FileText, Clock, AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, referrals, patients } = useStore();

  const pendingReferrals = referrals.filter(r => r.status === 'Pending').length;
  // Simulate a "delayed" case (Pending for more than 20 mins)
  const delayedReferrals = referrals.filter(r => 
    r.status === 'Pending' && (new Date() - new Date(r.createdAt)) > 20 * 60 * 1000
  ).length;

  const stats = [
    { name: 'Active Referrals', value: referrals.filter(r => r.status !== 'Completed').length, icon: FileText, color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800' },
    { name: 'Incoming Today', value: referrals.length, icon: ArrowRight, color: 'text-sky-700 dark:text-sky-400', bg: 'bg-sky-100 dark:bg-sky-900/30' },
    { name: 'Delayed Cases', value: delayedReferrals, icon: AlertTriangle, color: 'text-danger', bg: 'bg-danger-light dark:bg-danger/20' },
    { name: 'Registered Patients', value: patients.length, icon: Users, color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800' },
  ];

  return (
    <div className="space-y-6 transition-colors duration-200">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter">System Intelligence</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
            Authenticated: <span className="text-accent">{user?.name}</span> • {user?.facility || 'County HQ'}
          </p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase">System Time</p>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{format(new Date(), 'HH:mm')} EAT</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 p-4 transition-all hover:shadow-md">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-sm p-2 ${item.bg}`}>
                <item.icon className={`h-5 w-5 ${item.color}`} aria-hidden="true" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-tight">{item.name}</dt>
                  <dd className="text-xl font-black text-slate-900 dark:text-slate-100">{item.value}</dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
            <h3 className="text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-[0.1em]">Recent Loop Activities</h3>
            <span className="flex items-center text-[10px] text-success font-black uppercase tracking-tighter">
              <div className="h-1.5 w-1.5 rounded-full bg-success mr-1.5 animate-pulse"></div>
              Live Feed
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-800/30">
                <tr>
                  <th className="px-4 py-2 text-left text-[9px] font-black text-slate-500 uppercase tracking-widest">Patient</th>
                  <th className="px-4 py-2 text-left text-[9px] font-black text-slate-500 uppercase tracking-widest">Facility Origin</th>
                  <th className="px-4 py-2 text-left text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                  <th className="px-4 py-2 text-right text-[9px] font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                {referrals.slice(0, 6).map((referral) => {
                  const patient = patients.find(p => p.id === referral.patientId);
                  const isDelayed = referral.status === 'Pending' && (new Date() - new Date(referral.createdAt)) > 20 * 60 * 1000;
                  
                  return (
                    <tr 
                      key={referral.id} 
                      onClick={() => navigate(`/referrals/${referral.id}`)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-xs font-bold text-slate-900 dark:text-slate-100">{patient?.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-[10px] text-slate-600 dark:text-slate-400 font-medium truncate max-w-[150px]">{referral.fromFacility}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className={`px-2 py-0.5 inline-flex text-[9px] font-black uppercase rounded-sm border
                          ${referral.status === 'Completed' ? 'bg-success-light dark:bg-success/10 border-success/20 text-success' : 
                            isDelayed ? 'bg-danger-light dark:bg-danger/10 border-danger/20 text-danger animate-pulse' : 
                            referral.status === 'Pending' ? 'bg-warning-light dark:bg-warning/10 border-warning/20 text-warning' : 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-400'}`}>
                          {referral.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">
                        {format(new Date(referral.createdAt), 'HH:mm')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800">
            <button onClick={() => navigate('/referrals')} className="w-full text-[10px] font-black uppercase text-accent hover:text-accent-hover tracking-[0.2em]">View Full Operational Log</button>
          </div>
        </div>

        {/* System Health / Analytics Mini */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-sm shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp size={80} />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Traffic Performance</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                  <span>Referral Clearance</span>
                  <span className="text-success">84%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-success h-full w-[84%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                  <span>Average ETA</span>
                  <span className="text-sky-400">32 Mins</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-sky-400 h-full w-[65%]"></div>
                </div>
              </div>
            </div>
            <p className="text-[9px] text-slate-500 mt-6 leading-relaxed">System performing within standard clinical parameters for Kakamega County HQ.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Security Protocol</h4>
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Users size={16} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase leading-none">Access Log</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Your session: 12:45:01</p>
              </div>
            </div>
            <button className="w-full py-2 border border-slate-200 dark:border-slate-800 text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Audit Trail</button>
          </div>
        </div>
      </div>
    </div>
  );
}
