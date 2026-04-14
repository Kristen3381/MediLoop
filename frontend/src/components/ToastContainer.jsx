import { useStore } from '../store/useStore';
import clsx from 'clsx';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function ToastContainer() {
  const { toasts } = useStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            "flex items-center p-4 min-w-[300px] shadow-lg border rounded-sm transition-all animate-in slide-in-from-right duration-300",
            toast.type === 'success' ? "bg-success-light border-success text-success" : "bg-danger-light border-danger text-danger"
          )}
        >
          {toast.type === 'success' ? <CheckCircle className="h-5 w-5 mr-3" /> : <AlertCircle className="h-5 w-5 mr-3" />}
          <p className="text-xs font-bold uppercase flex-1 tracking-tight">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}
