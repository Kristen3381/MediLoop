import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import CreateReferralModal from '../components/CreateReferralModal';
import { Plus, Filter, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function Referrals() {
  const navigate = useNavigate();
  const { referrals, patients } = useStore();
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredReferrals = filter === 'All' 
    ? referrals 
    : referrals.filter(r => r.status === filter);

  const isAmbulance = useStore(state => state.user?.role === 'Ambulance Staff');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {isAmbulance ? 'Dispatch Communications' : 'Referral Central'}
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            {isAmbulance ? 'Active Transport Dispatches' : 'Loop Management System'} • Kakamega County
          </p>
        </div>
        {!isAmbulance && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-brand-gold flex items-center shadow-lg shadow-amber-500/20"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            Initiate Referral
          </button>
        )}
      </div>

      <div className="glass-card p-1.5 rounded-2xl flex space-x-1 border-none shadow-md overflow-x-auto">
        {['All', 'Pending', 'Accepted', 'Dispatch Requested', 'Dispatched', 'In Transit', 'Arrived', 'Completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`flex-1 py-2.5 text-[10px] font-bold uppercase transition-all tracking-widest rounded-xl ${
              filter === status 
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-lg' 
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-2xl border-none shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200/50 dark:divide-slate-700/50">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient Record</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Routing Path</th>
                <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredReferrals.map((referral) => {
                const patient = patients.find(p => p.id === referral.patientId);
                const isDelayed = referral.status === 'Pending' && (new Date() - new Date(referral.createdAt)) > 20 * 60 * 1000;

                return (
                  <tr 
                    key={referral.id} 
                    onClick={() => navigate(`/referrals/${referral.id}`)}
                    className="cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors">{patient?.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1 uppercase tracking-tighter">{referral.id}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{referral.fromFacility}</span>
                        <ArrowRight size={12} className="text-slate-300" />
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{referral.toFacility}</span>
                      </div>
                    </td>
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
                    <td className="px-6 py-5 whitespace-nowrap text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                      {format(new Date(referral.createdAt), 'MMM d, HH:mm')}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <span className="text-[10px] font-bold uppercase text-brand-gold group-hover:underline tracking-widest bg-brand-gold/5 px-3 py-1 rounded-full border border-brand-gold/10">
                        Open Loop
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filteredReferrals.length === 0 && (
            <div className="py-24 text-center">
              <div className="text-slate-300 dark:text-slate-700 mb-4 flex justify-center">
                <Filter size={48} strokeWidth={1} />
              </div>
              <p className="text-sm text-slate-400 font-medium uppercase tracking-widest">No matching referrals found</p>
            </div>
          )}
        </div>
      </div>

      <CreateReferralModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
