import { useState } from 'react';
import { useStore } from '../store/useStore';
import { X } from 'lucide-react';

export default function AddPatientModal({ isOpen, onClose }) {
  const { addPatient, addToast } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    condition: '',
    history: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.phone || !formData.condition) return;

    addPatient({
      ...formData,
      age: parseInt(formData.age, 10)
    });
    
    addToast(`Patient ${formData.name} registered successfully`);
    
    // Reset and close
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
      condition: '',
      history: ''
    });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden rounded-sm transition-colors">
        <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">New Patient Registration</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={16} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-[10px] font-black text-slate-700 dark:text-slate-400 uppercase tracking-tight mb-1">Full Legal Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-sm py-2 px-3 focus:outline-none focus:border-slate-500 dark:bg-slate-950 dark:text-white"
              placeholder="e.g. Jane Atieno"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-700 dark:text-slate-400 uppercase tracking-tight mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="block w-full text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-sm py-2 px-3 focus:outline-none focus:border-slate-500 dark:bg-slate-950 dark:text-white"
                placeholder="25"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-700 dark:text-slate-400 uppercase tracking-tight mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="block w-full text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-sm py-2 px-3 focus:outline-none focus:border-slate-500 dark:bg-slate-950 dark:text-white"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-700 dark:text-slate-400 uppercase tracking-tight mb-1">Contact (07XXXXXXXX)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="block w-full text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-sm py-2 px-3 focus:outline-none focus:border-slate-500 dark:bg-slate-950 dark:text-white font-mono"
              placeholder="0712345678"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-700 dark:text-slate-400 uppercase tracking-tight mb-1">Clinical Complaint</label>
            <textarea
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              rows={2}
              className="block w-full text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-sm py-2 px-3 focus:outline-none focus:border-slate-500 dark:bg-slate-950 dark:text-white"
              placeholder="Initial diagnosis..."
              required
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-black uppercase rounded-sm hover:opacity-90 transition-all shadow-xl"
            >
              Commit to Registry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
