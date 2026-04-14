import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore, canAcceptReferral, canManageReferral, canUpdateTransitStatus, canFinalizeReferral, canRequestDispatch, canAcceptDispatch } from '../store/useStore';
import TrackingTimeline from '../components/TrackingTimeline';
import { MessageSquare, Send, ArrowLeft, User, Building, Clock, CheckCircle, Truck, MapPin, CheckSquare, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

export default function ReferralDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { referrals, patients, updateReferralStatus, addMessage, user, addToast } = useStore();
  const referral = referrals.find(r => r.id === id);
  const patient = patients.find(p => p.id === referral?.patientId);
  
  const [messageText, setMessageText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const isAmbulance = user?.role === 'Ambulance Staff';

  if (!referral) return <div className="p-10 text-center text-slate-500">Referral record not found</div>;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    addMessage(id, user?.name || 'Authorized Staff', messageText);
    setMessageText('');
    addToast('Message dispatched');
  };

  const transitionStatus = async () => {
    const statuses = ['Pending', 'Accepted', 'Dispatch Requested', 'Dispatched', 'In Transit', 'Arrived', 'Completed'];
    const currentIndex = statuses.indexOf(referral.status);
    const nextStatus = statuses[currentIndex + 1];
    
    if (!nextStatus) return;

    // RBAC Check
    if (nextStatus === 'Accepted' && !canAcceptReferral(user?.role)) {
      addToast('Unauthorized: Only Doctors/Admins can accept referrals', 'error');
      return;
    }

    if (nextStatus === 'Dispatch Requested' && !canRequestDispatch(user?.role)) {
      addToast('Unauthorized: Only Doctors/Nurses can request dispatch', 'error');
      return;
    }

    if (nextStatus === 'Dispatched' && !canAcceptDispatch(user?.role)) {
      addToast('Unauthorized: Only Ambulance Staff can accept dispatch', 'error');
      return;
    }
    
    if (nextStatus === 'In Transit' && !canUpdateTransitStatus(user?.role)) {
      addToast('Unauthorized: Insufficient permissions to update transport status', 'error');
      return;
    }
    
    if (nextStatus === 'Arrived' && !canUpdateTransitStatus(user?.role)) {
      addToast('Unauthorized: Insufficient permissions to update arrival status', 'error');
      return;
    }

    if (nextStatus === 'Completed' && !canFinalizeReferral(user?.role)) {
      addToast('Unauthorized: Only clinical staff/admins can finalize referrals', 'error');
      return;
    }

    if (!canManageReferral(user?.role) && !isAmbulance) {
      addToast('Unauthorized: Insufficient permissions', 'error');
      return;
    }

    setIsUpdating(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate logic
    
    updateReferralStatus(id, nextStatus);
    addToast(`Referral transitioned to ${nextStatus}`);
    setIsUpdating(false);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <Clock size={16} />;
      case 'Accepted': return <CheckSquare size={16} />;
      case 'Rejected': return <XCircle size={16} />;
      case 'Dispatch Requested': return <Send size={16} />;
      case 'Dispatched': return <Truck size={16} />;
      case 'In Transit': return <Truck size={16} className="animate-bounce" />;
      case 'Arrived': return <MapPin size={16} />;
      case 'Completed': return <CheckCircle size={16} />;
      default: return null;
    }
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
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">Referral Loop Control</h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide">ID: {referral.id} • Registered {format(new Date(referral.createdAt), 'MMM d, h:mm a')}</p>
          </div>
        </div>
        
        <div className={clsx(
          "px-3 py-1 text-[10px] font-black uppercase rounded-sm border flex items-center space-x-2",
          referral.status === 'Completed' ? "bg-success-light border-success text-success" : 
          referral.status === 'Rejected' ? "bg-danger-light border-danger text-danger" :
          "bg-warning-light border-warning text-warning"
        )}>
          {getStatusIcon(referral.status)}
          <span>{referral.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Details & Timeline */}
        <div className={clsx("space-y-6", isAmbulance ? "lg:col-span-12" : "lg:col-span-8")}>
          {!isAmbulance && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Card */}
                <Link to={`/patients/${patient?.id}`} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 hover:border-slate-400 dark:hover:border-slate-600 transition-all group shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient Information</span>
                    <User size={14} className="text-slate-300 group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{patient?.name}</h3>
                  <p className="text-xs text-slate-500">{patient?.age}Y • {patient?.gender} • {patient?.id}</p>
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] uppercase font-bold text-accent">
                    View Full Medical History <ArrowLeft size={12} className="rotate-180" />
                  </div>
                </Link>

                {/* Transfer Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transfer Routing</span>
                    <Building size={14} className="text-slate-300" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">From Origin</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{referral.fromFacility}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">To Destination</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{referral.toFacility}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Reason */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Clinical Referral Reason</h3>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {referral.reason}
                </p>
              </div>

              {/* Timeline Visualizer */}
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-8">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 text-center">Referral Progress Loop</h3>
                <div className="max-w-md mx-auto">
                  <TrackingTimeline timeline={referral.timeline} />
                </div>
              </div>
            </>
          )}

          {isAmbulance && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4">
                 {/* Status Actions */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-lg h-full">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Transport Protocol</h3>
                  <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-sm">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Target Patient</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{patient?.name}</p>
                    <p className="text-xs text-slate-500 font-medium">To: {referral.toFacility}</p>
                  </div>
                  {referral.status === 'Completed' || referral.status === 'Arrived' ? (
                    <div className="bg-success-light text-success p-4 border border-success/20 rounded-sm text-center">
                      <CheckCircle size={24} className="mx-auto mb-2" />
                      <p className="text-xs font-bold uppercase">Dispatch Cycle Completed</p>
                      <p className="text-[10px] mt-1 opacity-80">Patient successfully arrived at destination</p>
                    </div>
                  ) : referral.status === 'Rejected' ? (
                    <div className="bg-danger-light text-danger p-4 border border-danger/20 rounded-sm text-center">
                      <XCircle size={24} className="mx-auto mb-2" />
                      <p className="text-xs font-bold uppercase">Referral Rejected</p>
                      <p className="text-[10px] mt-1 opacity-80">This referral has been rejected by the destination facility</p>
                    </div>
                  ) : (
                    <button
                      onClick={transitionStatus}
                      disabled={isUpdating}
                      className={clsx(
                        "w-full py-4 bg-accent text-white text-xs font-bold uppercase rounded-sm hover:opacity-90 transition-all shadow-xl flex items-center justify-center space-x-3",
                        isUpdating && "animate-pulse cursor-not-allowed"
                      )}
                    >
                      {isUpdating ? 'Executing...' : (
                        <>
                          <span>Advance to: {
                            referral.status === 'Pending' ? 'Accepted' :
                            referral.status === 'Accepted' ? 'Dispatch Requested' :
                            referral.status === 'Dispatch Requested' ? 'Dispatched' :
                            referral.status === 'Dispatched' ? 'In Transit' :
                            referral.status === 'In Transit' ? 'Arrived' : 'Completed'
                          }</span>
                          <ArrowLeft size={16} className="rotate-180" />
                        </>
                      )}
                    </button>
                  )}
                  <p className="text-[9px] text-center text-slate-400 mt-4 uppercase font-bold tracking-widest">Protocol synchronized with dispatch hub</p>
                </div>
              </div>

              <div className="lg:col-span-8">
                {/* Chat Interface for Ambulance */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col h-[450px] shadow-sm">
                  <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex items-center">
                    <MessageSquare size={14} className="text-slate-400 mr-2" />
                    <h3 className="text-[10px] font-bold text-slate-900 dark:text-slate-100 uppercase">Dispatch Communication Hub</h3>
                  </div>
                  
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50">
                    {referral.messages?.map((m, i) => (
                      <div key={i} className={clsx("flex flex-col", m.sender === user?.name ? "items-end" : "items-start")}>
                        <div className={clsx(
                          "px-3 py-2 text-xs rounded-sm max-w-[85%] shadow-sm",
                          m.sender === user?.name ? "bg-slate-800 text-white" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                        )}>
                          <p className="font-black text-[9px] uppercase mb-1 opacity-70">{m.sender}</p>
                          <p className="leading-relaxed">{m.text}</p>
                        </div>
                        <span className="text-[9px] text-slate-400 mt-1 uppercase font-bold">{format(new Date(m.time), 'h:mm a')}</span>
                      </div>
                    ))}
                    {(!referral.messages || referral.messages.length === 0) && (
                      <div className="h-full flex items-center justify-center text-slate-400 text-[10px] italic">No active communication on this dispatch</div>
                    )}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex space-x-2">
                    <input 
                      type="text" 
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Send message to hospital..."
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 transition-colors"
                    />
                    <button type="submit" className="p-2 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-all">
                      <Send size={16} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Controls & Messaging (Only for NON-Ambulance as it's redundant now for Ambulance) */}
        {!isAmbulance && (
          <div className="lg:col-span-4 space-y-6">
            {/* Status Actions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-lg">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Process Management</h3>
              {referral.status === 'Completed' ? (
                <div className="bg-success-light text-success p-4 border border-success/20 rounded-sm text-center">
                  <CheckCircle size={24} className="mx-auto mb-2" />
                  <p className="text-xs font-bold uppercase">Referral Cycle Completed</p>
                  <p className="text-[10px] mt-1 opacity-80">Patient records archived in destination registry</p>
                </div>
              ) : referral.status === 'Rejected' ? (
                <div className="bg-danger-light text-danger p-4 border border-danger/20 rounded-sm text-center">
                  <XCircle size={24} className="mx-auto mb-2" />
                  <p className="text-xs font-bold uppercase">Referral Rejected</p>
                  <p className="text-[10px] mt-1 opacity-80">This referral has been rejected by the destination facility</p>
                </div>
              ) : (
                <button
                  onClick={transitionStatus}
                  disabled={isUpdating}
                  className={clsx(
                    "w-full py-4 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold uppercase rounded-sm hover:opacity-90 transition-all shadow-xl flex items-center justify-center space-x-3",
                    isUpdating && "animate-pulse cursor-not-allowed"
                  )}
                >
                  {isUpdating ? 'Executing...' : (
                    <>
                      <span>Advance to: {
                        referral.status === 'Pending' ? 'Accepted' :
                        referral.status === 'Accepted' ? 'Dispatch Requested' :
                        referral.status === 'Dispatch Requested' ? 'Dispatched' :
                        referral.status === 'Dispatched' ? 'In Transit' :
                        referral.status === 'In Transit' ? 'Arrived' : 'Completed'
                      }</span>
                      <ArrowLeft size={16} className="rotate-180" />
                    </>
                  )}
                </button>
              )}
              <p className="text-[9px] text-center text-slate-400 mt-4 uppercase font-bold">Action will be logged with your personnel ID</p>
            </div>

            {/* Chat Interface */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col h-[400px] shadow-sm">
              <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex items-center">
                <MessageSquare size={14} className="text-slate-400 mr-2" />
                <h3 className="text-[10px] font-bold text-slate-900 dark:text-slate-100 uppercase">Loop Communication</h3>
              </div>
              
              <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50">
                {referral.messages?.map((m, i) => (
                  <div key={i} className={clsx("flex flex-col", m.sender === user?.name ? "items-end" : "items-start")}>
                    <div className={clsx(
                      "px-3 py-2 text-xs rounded-sm max-w-[85%] shadow-sm",
                      m.sender === user?.name ? "bg-slate-800 text-white" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    )}>
                      <p className="font-black text-[9px] uppercase mb-1 opacity-70">{m.sender}</p>
                      <p className="leading-relaxed">{m.text}</p>
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 uppercase font-bold">{format(new Date(m.time), 'h:mm a')}</span>
                  </div>
                ))}
                {(!referral.messages || referral.messages.length === 0) && (
                  <div className="h-full flex items-center justify-center text-slate-400 text-[10px] italic">No active communication on this loop</div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex space-x-2">
                <input 
                  type="text" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Disptach message..."
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 transition-colors"
                />
                <button type="submit" className="p-2 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-all">
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
