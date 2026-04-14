import { useState } from 'react';
import { useStore } from '../store/useStore';
import { X } from 'lucide-react';

export default function CreateReferralModal({ isOpen, onClose }) {
  const { patients, facilities, addReferral, user, addToast } = useStore();
  const [patientId, setPatientId] = useState('');
  const [toFacility, setToFacility] = useState('');
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patientId || !toFacility || !reason) return;

    addReferral({
      patientId,
      toFacility,
      reason,
      fromFacility: user?.facility || 'Unknown Facility',
      assignedDoctor: 'Unassigned'
    });
    
    addToast('Referral loop initiated successfully');
    
    // Reset and close
    setPatientId('');
    setToFacility('');
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden rounded-sm transition-colors">
        <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Referral Loop Authorization</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={16} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-700 dark:text-slate-400 uppercase tracking-tight mb-1">Target Patient Registry</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="block w-full text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-sm py-2.5 px-3 focus:outline-none focus:border-slate-500 dark:bg-slate-950 dark:text-white transition-colors"
              required
            >
              <option value="" disabled>Search patient records...</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-700 dark:text-slate-400 uppercase tracking-tight mb-1">Destination Facility</label>
            <select
              value={toFacility}
              onChange={(e) => setToFacility(e.target.value)}
              className="block w-full text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-sm py-2.5 px-3 focus:outline-none focus:border-slate-500 dark:bg-slate-950 dark:text-white transition-colors"
              required
            >
              <option value="" disabled>Select receiving hospital...</option>
              {facilities.map(f => (
                <option key={f.id} value={f.name}>{f.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-700 dark:text-slate-400 uppercase tracking-tight mb-1">Clinical Context & Vitals</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="block w-full text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-sm py-2.5 px-3 focus:outline-none focus:border-slate-500 dark:bg-slate-950 dark:text-white transition-colors"
              placeholder="Detailed reason for transfer..."
              required
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-black uppercase rounded-sm hover:opacity-90 transition-all shadow-xl"
            >
              Authorize Dispatch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
