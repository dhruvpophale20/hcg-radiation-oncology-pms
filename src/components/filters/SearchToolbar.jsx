import { Search, X, SlidersHorizontal, Upload, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DIAGNOSIS_CATEGORIES, PAYMENT_TYPES, PATIENT_FLAGS } from '../../utils/constants';
import { exportToCSV } from '../../utils/csvUtils';
import { parseCSV } from '../../utils/csvUtils';
import { addPatient } from '../../firebase/patientService';
import toast from 'react-hot-toast';
import { useRef } from 'react';

export default function SearchToolbar() {
  const { state, dispatch, filteredPatients } = useApp();
  const { search, filterCategory, filterPayment, filterFlag, currentMonth, currentYear } = state;
  const csvInputRef = useRef(null);

  const hasFilters = search || filterCategory || filterPayment || filterFlag;

  const handleCSVImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const { data, errors } = await parseCSV(file);
    if (errors.length) toast.error(`CSV parse warnings: ${errors.length} row(s) skipped`);
    if (!data.length) return toast.error('No valid rows found in CSV');

    const toastId = toast.loading(`Importing ${data.length} patients…`);
    let ok = 0;
    for (const row of data) {
      try {
        await addPatient({ ...row, month: currentMonth, year: currentYear });
        ok++;
      } catch (err) {
        console.error(err);
      }
    }
    toast.dismiss(toastId);
    toast.success(`Imported ${ok} of ${data.length} patients`);
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2">
      {/* Search */}
      <div className="relative w-full sm:flex-1 sm:min-w-52">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search name, diagnosis, referring doctor…"
          value={search}
          onChange={e => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition placeholder:text-slate-400"
        />
      </div>

      {/* Category filter */}
      <select
        value={filterCategory}
        onChange={e => dispatch({ type: 'SET_FILTER_CATEGORY', payload: e.target.value })}
        className="w-full sm:w-auto px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700
          focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
      >
        <option value="">All Categories</option>
        {DIAGNOSIS_CATEGORIES.map(c => <option key={c}>{c}</option>)}
      </select>

      {/* Payment filter */}
      <select
        value={filterPayment}
        onChange={e => dispatch({ type: 'SET_FILTER_PAYMENT', payload: e.target.value })}
        className="w-full sm:w-auto px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700
          focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
      >
        <option value="">All Payments</option>
        {PAYMENT_TYPES.map(t => <option key={t}>{t}</option>)}
      </select>

      {/* Flag filter */}
      <select
        value={filterFlag}
        onChange={e => dispatch({ type: 'SET_FILTER_FLAG', payload: e.target.value })}
        className="w-full sm:w-auto px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700
          focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
      >
        <option value="">All Flags</option>
        {PATIENT_FLAGS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
      </select>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 bg-white rounded-lg transition hover:bg-slate-50"
        >
          <X size={13} /> Clear
        </button>
      )}

      <div className="flex-1" />

      {/* CSV Import */}
      <input ref={csvInputRef} type="file" accept=".csv" className="hidden" onChange={handleCSVImport} />
      <button
        onClick={() => csvInputRef.current?.click()}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition"
      >
        <Upload size={14} /> Import CSV
      </button>

      {/* CSV Export */}
      <button
        onClick={() => exportToCSV(filteredPatients, currentMonth, currentYear)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition"
      >
        <Download size={14} /> Export CSV
      </button>
    </div>
  );
}
