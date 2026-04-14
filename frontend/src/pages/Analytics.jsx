import { useStore } from '../store/useStore';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function Analytics() {
  const { referrals } = useStore();

  const statusData = [
    { name: 'Pending', count: referrals.filter(r => r.status === 'Pending').length },
    { name: 'Accepted', count: referrals.filter(r => r.status === 'Accepted').length },
    { name: 'In Transit', count: referrals.filter(r => r.status === 'In Transit').length },
    { name: 'Arrived', count: referrals.filter(r => r.status === 'Arrived').length },
    { name: 'Completed', count: referrals.filter(r => r.status === 'Completed').length },
  ];

  const timeData = [
    { name: 'Mon', time: 45 },
    { name: 'Tue', time: 52 },
    { name: 'Wed', time: 38 },
    { name: 'Thu', time: 65 },
    { name: 'Fri', time: 48 },
    { name: 'Sat', time: 30 },
    { name: 'Sun', time: 40 },
  ];

  const facilityData = [
    { name: 'Kakamega Gen', value: 400 },
    { name: 'Lumakanda', value: 200 },
    { name: 'Mumias L4', value: 300 },
    { name: 'St. Mary’s', value: 150 },
    { name: 'Malava', value: 100 },
  ];

  const COLORS = ['#334155', '#0284c7', '#059669', '#d97706', '#dc2626'];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter">System Analytics</h1>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Kakamega County Health Intelligence Dashboard</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referrals by Status */}
        <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase mb-6 tracking-widest border-l-4 border-slate-800 dark:border-slate-100 pl-3">Referral Distribution (Current)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: '#f8fafc', opacity: 0.1 }} contentStyle={{ fontSize: '10px', fontWeight: 'bold', borderRadius: '0px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#334155" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Average Response Time */}
        <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <h3 className="text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase mb-6 tracking-widest border-l-4 border-accent pl-3">System Response Latency (Mins)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: '10px', fontWeight: 'bold', borderRadius: '0px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="time" stroke="#0284c7" strokeWidth={3} dot={{ r: 4, fill: '#0284c7', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Facility Distribution */}
        <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors lg:col-span-2">
          <h3 className="text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase mb-6 tracking-widest border-l-4 border-success pl-3">Referral Load per Receiving Facility</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={facilityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  style={{ fontSize: '9px', fontWeight: 'black', textTransform: 'uppercase', fill: '#94a3b8' }}
                >
                  {facilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '10px', fontWeight: 'bold', borderRadius: '0px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
