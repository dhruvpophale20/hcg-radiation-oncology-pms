import { Activity, Zap, LayoutDashboard, Users, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MONTHS } from '../../utils/constants';

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Users,           label: 'Patients'  },
  { icon: Activity,        label: 'Analytics' },
];

export default function Sidebar({ open, onClose }) {
  const { state, navigateMonth } = useApp();
  const { currentMonth, currentYear, patients } = state;

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:w-60 lg:shrink-0 lg:z-auto
      `}
    >
      {/* Logo + mobile close */}
      <div className="px-5 py-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shrink-0">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-400 uppercase tracking-widest leading-none">HCG Hospital</p>
            <p className="text-sm font-bold text-white font-heading mt-0.5 leading-tight">Radiation Oncology</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
          <X size={18} />
        </button>
      </div>

      {/* Month Navigator */}
      <div className="px-4 py-4 border-b border-slate-800">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Period</p>
        <div className="flex items-center justify-between bg-slate-800 rounded-xl px-2 py-1.5">
          <button onClick={() => navigateMonth(-1)}
            className="p-1.5 rounded-lg hover:bg-slate-700 transition text-slate-400 hover:text-white">
            <ChevronLeft size={16} />
          </button>
          <div className="text-center">
            <p className="text-white font-semibold text-sm font-heading">{MONTHS[currentMonth - 1]}</p>
            <p className="text-slate-400 text-xs">{currentYear}</p>
          </div>
          <button onClick={() => navigateMonth(1)}
            className="p-1.5 rounded-lg hover:bg-slate-700 transition text-slate-400 hover:text-white">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ icon: Icon, label }) => (
          <button key={label}
            onClick={onClose}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition
              ${label === 'Dashboard' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
            SK
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">Dr. S.K. Mohanty</p>
            <p className="text-xs text-slate-500 truncate">Radiation Oncology</p>
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-3">
          {patients.length} patient{patients.length !== 1 ? 's' : ''} this month
        </p>
      </div>
    </aside>
  );
}
