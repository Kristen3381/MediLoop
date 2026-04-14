import { format } from 'date-fns';
import clsx from 'clsx';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const STATUS_ORDER = ['Created', 'Accepted', 'In Transit', 'Arrived', 'Completed'];

export default function TrackingTimeline({ timeline }) {
  const currentStatusIndex = Math.max(
    ...timeline.map(t => STATUS_ORDER.indexOf(t.status))
  );

  return (
    <div className="flow-root">
      <ul className="-mb-6">
        {STATUS_ORDER.map((status, index) => {
          const isCompleted = index <= currentStatusIndex;
          const isLast = index === STATUS_ORDER.length - 1;
          const event = timeline.find(t => t.status === status);

          return (
            <li key={status}>
              <div className="relative pb-6">
                {!isLast && (
                  <span
                    className={clsx(
                      "absolute top-4 left-3 -ml-px h-full w-0.5",
                      isCompleted ? "bg-slate-700 dark:bg-slate-500" : "bg-slate-200 dark:bg-slate-800"
                    )}
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={clsx(
                      "h-6 w-6 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-900 shadow-sm",
                      isCompleted ? "bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900" : "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600"
                    )}>
                      {isCompleted ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1 flex justify-between space-x-4">
                    <div>
                      <p className={clsx("text-[10px] font-bold uppercase tracking-wider", isCompleted ? "text-slate-800 dark:text-slate-100" : "text-slate-400 dark:text-slate-600")}>
                        {status}
                      </p>
                    </div>
                    <div className="text-right text-[10px] whitespace-nowrap text-slate-400 dark:text-slate-500 font-bold uppercase">
                      {event ? (
                        <time dateTime={event.time}>{format(new Date(event.time), 'h:mm a')}</time>
                      ) : (
                        <span className="flex items-center tracking-tighter opacity-50"><Clock size={10} className="mr-1"/> PENDING</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
