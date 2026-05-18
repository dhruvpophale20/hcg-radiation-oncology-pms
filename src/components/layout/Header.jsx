import { Plus, Trash2, Menu } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MONTHS } from '../../utils/constants';

export default function Header({ onMenuToggle }) {
  const { state, dispatch } = useApp();
  const { currentMonth, currentYear } = state;

  return (
    <header className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-30 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition shrink-0"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold font-heading text-slate-900 leading-none truncate">
            Patient Registry
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
            {MONTHS[currentMonth - 1]} {currentYear} · HCG Hospital, Rajkot
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => dispatch({ type: 'OPEN_REMOVE' })}
          className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 text-xs sm:text-sm font-medium text-red-600 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition"
        >
          <Trash2 size={14} />
          <span className="hidden sm:inline">Remove Patient</span>
        </button>
        <button
          onClick={() => dispatch({ type: 'OPEN_ADD' })}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition shadow-sm"
        >
          <Plus size={15} />
          <span className="hidden xs:inline">Add Patient</span>
          <span className="sm:hidden xs:hidden">Add</span>
        </button>
      </div>
    </header>
  );
}
