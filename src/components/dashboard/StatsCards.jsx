import { motion } from 'framer-motion';
import { Users, Banknote, ShieldCheck, HeartPulse, UserCheck, Zap, Activity, ClipboardList } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import CountUp from '../common/CountUp';

const STATS = [
  {
    key: 'total',
    label: 'Total Patients',
    icon: Users,
    color: 'bg-brand-50 text-brand-600',
    border: 'border-brand-100',
    fn: p => p.length,
  },
  {
    key: 'cash',
    label: 'Cash',
    icon: Banknote,
    color: 'bg-emerald-50 text-emerald-600',
    border: 'border-emerald-100',
    fn: p => p.filter(x => x.paymentType === 'Cash').length,
  },
  {
    key: 'pmjaya',
    label: 'PM-JAYA',
    icon: ShieldCheck,
    color: 'bg-amber-50 text-amber-600',
    border: 'border-amber-100',
    fn: p => p.filter(x => x.paymentType === 'PM-JAYA').length,
  },
  {
    key: 'insurance',
    label: 'Insurance',
    icon: HeartPulse,
    color: 'bg-sky-50 text-sky-600',
    border: 'border-sky-100',
    fn: p => p.filter(x => x.paymentType === 'Insurance').length,
  },
  {
    key: 'referred',
    label: 'Referrals',
    icon: UserCheck,
    color: 'bg-violet-50 text-violet-600',
    border: 'border-violet-100',
    fn: p => p.filter(x => (x.flags || []).includes('Referred')).length,
  },
  {
    key: 'simulation',
    label: 'Simulations',
    icon: Activity,
    color: 'bg-teal-50 text-teal-600',
    border: 'border-teal-100',
    fn: p => p.filter(x => (x.flags || []).includes('Simulation')).length,
  },
  {
    key: 'needsRT',
    label: 'Needs RT',
    icon: Zap,
    color: 'bg-rose-50 text-rose-600',
    border: 'border-rose-100',
    fn: p => p.filter(x => (x.flags || []).includes('Needs Radiotherapy')).length,
  },
  {
    key: 'followup',
    label: 'Follow-ups',
    icon: ClipboardList,
    color: 'bg-orange-50 text-orange-600',
    border: 'border-orange-100',
    fn: p => p.filter(x => (x.flags || []).includes('Follow-up (Cash)')).length,
  },
];

export default function StatsCards() {
  const { state } = useApp();
  const { patients, loading } = state;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {STATS.map((stat, i) => {
        const Icon = stat.icon;
        const value = stat.fn(patients);
        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            className={`bg-white rounded-xl border ${stat.border} p-4 shadow-card flex items-center gap-4 hover:shadow-hover transition-shadow`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 leading-none mb-1">{stat.label}</p>
              {loading ? (
                <div className="h-6 w-8 bg-slate-100 rounded animate-pulse" />
              ) : (
                <CountUp value={value} className="text-2xl font-bold font-heading text-slate-900 leading-none" />
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
