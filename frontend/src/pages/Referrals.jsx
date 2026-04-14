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

  const getStatusColor = (status, createdAt) => {
    const isDelayed = status === 'Pending' && (new Date() - new Date(createdAt)) > 20 * 60 * 1000;
    if (isDelayed) return 'bg-danger-light text-danger dark:bg-danger/20';
    
    switch(status) {
      case 'Pending': return 'bg-warning-light text-warning dark:bg-warning/20';
      case 'Accepted': return 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400';
      case 'In Transit': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Arrived': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'Completed': return 'bg-success-light text-success dark:bg-success/20';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">Referral Central</h1>
          <p className="text-xs text-slate-500 font-medium">Loop Management System • Kakamega County</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold uppercase rounded-sm hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors shadow-sm"
        >
          <Plus className="-ml-1 mr-2 h-4 w-4" />
          Initiate Referral
        </button>
      </div>

      <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-sm shadow-sm transition-colors">
        {['All', 'Pending', 'Accepted', 'In Transit', 'Completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`flex-1 py-2 text-[10px] font-black uppercase transition-all tracking-widest ${
              filter === status 
                ? 'bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 shadow-inner' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">Patient Record</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Routing Path</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">Timestamp</th>
                <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
              {filteredReferrals.map((referral) => {
                const patient = patients.find(p => p.id === referral.patientId);
                return (
                  <tr 
                    key={referral.id} 
                    onClick={() => navigate(`/referrals/${referral.id}`)}
                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">{patient?.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{referral.id}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-slate-800 dark:text-slate-300 truncate max-w-[120px]">{referral.fromFacility}</span>
                        <ArrowRight size={10} className="text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-800 dark:text-slate-300 truncate max-w-[120px]">{referral.toFacility}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-sm ${getStatusColor(referral.status, referral.createdAt)}`}>
                        {referral.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase">
                      {format(new Date(referral.createdAt), 'h:mm a')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <button className="text-[10px] font-black uppercase text-accent group-hover:underline">
                        Control Loop
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filteredReferrals.length === 0 && (
            <div className="py-20 text-center text-xs text-slate-400 dark:text-slate-600 italic uppercase tracking-widest">No matching referrals in loop</div>
          )}
        </div>
      </div>

      <CreateReferralModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
