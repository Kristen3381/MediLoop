import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore, canEditPatient } from '../store/useStore';
import { User, Phone, Calendar, Clipboard, History, Save, Edit2, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, referrals, updatePatient, user, addToast } = useStore();
  const patient = patients.find(p => p.id === id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(patient || {});
  const [isSaving, setIsSaving] = useState(false);

  if (!patient) return <div className="p-10 text-center text-slate-500">Patient not found in registry</div>;

  const canEdit = canEditPatient(user?.role);
  const patientReferrals = referrals.filter(r => r.patientId === id);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    updatePatient(id, formData);
    addToast('Patient records updated successfully');
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm text-slate-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">Patient Profile</h1>
            <p className="text-xs text-slate-500 font-medium">Record ID: {patient.id}</p>
          </div>
        </div>

        {canEdit && !isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-bold uppercase rounded-sm hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors shadow-sm"
          >
            <Edit2 size={14} className="mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex items-center">
              <User size={16} className="text-slate-400 mr-2" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase">Personal Details</h3>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Legal Name</label>
                  {isEditing ? (
                    <input 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-sm py-2 px-3 focus:outline-none focus:border-slate-400"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{patient.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Age</label>
                    {isEditing ? (
                      <input 
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-sm py-2 px-3 focus:outline-none focus:border-slate-400"
                      />
                    ) : (
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{patient.age}Y</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Gender</label>
                    {isEditing ? (
                      <select 
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-sm py-2 px-3 focus:outline-none focus:border-slate-400"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    ) : (
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{patient.gender}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Contact Phone</label>
                  {isEditing ? (
                    <input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full text-sm font-mono border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-sm py-2 px-3 focus:outline-none focus:border-slate-400"
                    />
                  ) : (
                    <p className="text-sm font-mono text-slate-900 dark:text-slate-100">{patient.phone}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Clinical Complaint</label>
                  {isEditing ? (
                    <textarea 
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      rows={2}
                      className="w-full text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-sm py-2 px-3 focus:outline-none focus:border-slate-400"
                    />
                  ) : (
                    <p className="text-sm text-slate-700 dark:text-slate-300">{patient.condition}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Medical History</label>
                  {isEditing ? (
                    <textarea 
                      name="history"
                      value={formData.history}
                      onChange={handleChange}
                      rows={3}
                      className="w-full text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-sm py-2 px-3 focus:outline-none focus:border-slate-400"
                    />
                  ) : (
                    <p className="text-sm text-slate-700 dark:text-slate-300 italic">{patient.history || 'No recorded history'}</p>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-2">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-[10px] font-bold uppercase text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors rounded-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className={clsx(
                    "inline-flex items-center px-6 py-2 bg-accent text-white text-[10px] font-bold uppercase rounded-sm hover:bg-accent-hover transition-colors shadow-sm disabled:opacity-50",
                    isSaving && "cursor-not-allowed"
                  )}
                >
                  {isSaving ? 'Processing...' : (
                    <>
                      <Save size={14} className="mr-2" />
                      Save Records
                    </>
                  )}
                </button>
              </div>
            )}
          </form>

          {/* Referral History */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex items-center">
              <History size={16} className="text-slate-400 mr-2" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase">Referral Loop History</h3>
            </div>
            <div className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">Origin</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">Destination</th>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                    {patientReferrals.length > 0 ? (
                      patientReferrals.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-900 dark:text-slate-300">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 dark:text-slate-400">
                            {r.fromFacility}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 dark:text-slate-400">
                            {r.toFacility}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-sm">
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-xs text-slate-400 italic">No previous referrals found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Context */}
        <div className="space-y-6">
          <div className="bg-slate-800 text-white p-6 rounded-sm shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Clipboard size={80} />
            </div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Registration Status</h4>
            <div className="flex items-center text-success mb-4">
              <div className="h-2 w-2 rounded-full bg-success mr-2 animate-pulse"></div>
              <span className="text-xs font-bold uppercase">Active in Registry</span>
            </div>
            <p className="text-xs text-slate-300 mb-6">This patient is currently verified and registered within the Kakamega County Health System.</p>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] uppercase border-b border-slate-700 pb-2">
                <span className="text-slate-400">Total Referrals</span>
                <span className="font-bold">{patientReferrals.length}</span>
              </div>
              <div className="flex justify-between text-[10px] uppercase border-b border-slate-700 pb-2">
                <span className="text-slate-400">Current Facility</span>
                <span className="font-bold">Kakamega General</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
