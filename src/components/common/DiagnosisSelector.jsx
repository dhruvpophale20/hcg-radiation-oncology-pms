import { useState, useMemo } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { DIAGNOSIS_GROUPS } from '../../utils/constants';

export default function DiagnosisSelector({ category, diagnosis, onCategoryChange, onDiagnosisChange }) {
  const [diagSearch, setDiagSearch] = useState('');
  const [open, setOpen] = useState(false);

  const availableDiagnoses = useMemo(() => {
    const list = category ? (DIAGNOSIS_GROUPS[category] || []) : Object.values(DIAGNOSIS_GROUPS).flat();
    if (!diagSearch.trim()) return list;
    return list.filter(d => d.toLowerCase().includes(diagSearch.toLowerCase()));
  }, [category, diagSearch]);

  const handleSelect = (d) => {
    onDiagnosisChange(d);
    setOpen(false);
    setDiagSearch('');
  };

  return (
    <div className="space-y-3">
      {/* Category */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
          Diagnosis Category <span className="text-red-400">*</span>
        </label>
        <select
          value={category}
          onChange={e => { onCategoryChange(e.target.value); onDiagnosisChange(''); }}
          className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800
            focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
          required
        >
          <option value="">Select category…</option>
          {Object.keys(DIAGNOSIS_GROUPS).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Specific Diagnosis */}
      <div className="relative">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
          Specific Diagnosis <span className="text-red-400">*</span>
        </label>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-left flex items-center justify-between
            focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition hover:border-slate-300"
        >
          <span className={diagnosis ? 'text-slate-800' : 'text-slate-400'}>
            {diagnosis || 'Select diagnosis…'}
          </span>
          <ChevronDown size={15} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-modal overflow-hidden">
            <div className="p-2 border-b border-slate-100">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search diagnoses…"
                  value={diagSearch}
                  onChange={e => setDiagSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
            <div className="max-h-52 overflow-y-auto py-1">
              {availableDiagnoses.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-4">No diagnoses found</p>
              ) : availableDiagnoses.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleSelect(d)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-brand-50 hover:text-brand-700 transition
                    ${d === diagnosis ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-700'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
