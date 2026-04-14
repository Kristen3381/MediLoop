import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Search, Plus, UserCircle } from 'lucide-react';
import AddPatientModal from '../components/AddPatientModal';

export default function Patients() {
  const navigate = useNavigate();
  const { patients } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">Patient Directory</h1>
          <p className="text-xs text-slate-500 font-medium">Official Registry • Kakamega County</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold uppercase rounded-sm hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors shadow-sm"
        >
          <Plus className="-ml-1 mr-2 h-4 w-4" />
          Register Patient
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="relative rounded-sm max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-9 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-sm py-2 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 dark:text-slate-100"
              placeholder="Search by name, ID or clinical condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-2 text-left text-[10px] font-bold text-slate-500 uppercase">Registry Name</th>
                <th className="px-4 py-2 text-left text-[10px] font-bold text-slate-500 uppercase">Age/Gender</th>
                <th className="px-4 py-2 text-left text-[10px] font-bold text-slate-500 uppercase">Contact</th>
                <th className="px-4 py-2 text-left text-[10px] font-bold text-slate-500 uppercase">Complaint</th>
                <th className="px-4 py-2 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
              {filteredPatients.map((patient) => (
                <tr 
                  key={patient.id} 
                  onClick={() => navigate(`/patients/${patient.id}`)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-sm bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-3 text-slate-400 group-hover:text-accent transition-colors">
                        <UserCircle size={20} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{patient.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{patient.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-700 dark:text-slate-400">
                    {patient.age}Y / {patient.gender}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-600 dark:text-slate-500 font-mono">
                    {patient.phone}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="text-xs text-slate-800 dark:text-slate-300 truncate max-w-[200px]" title={patient.condition}>{patient.condition}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-[10px] font-black uppercase text-accent group-hover:underline">
                    View Profile
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPatients.length === 0 && (
            <div className="py-20 text-center text-xs text-slate-400 dark:text-slate-600 italic">No matching records in registry</div>
          )}
        </div>
      </div>

      <AddPatientModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
