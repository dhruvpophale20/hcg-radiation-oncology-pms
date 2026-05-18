import { useState } from 'react';
import { Search, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { searchAllPatients, deletePatient } from '../../firebase/patientService';
import PaymentBadge from '../common/PaymentBadge';
import FlagBadge from '../common/FlagBadge';
import toast from 'react-hot-toast';

function formatDate(d) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

export default function RemoveModal() {
  const { state, dispatch } = useApp();
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [confirm, setConfirm] = useState(null); // patient object to confirm deletion
  const [deleting, setDeleting] = useState(false);

  const close = () => {
    dispatch({ type: 'CLOSE_REMOVE' });
    setQuery(''); setResults([]); setConfirm(null);
  };

  const handleSearch = async (val) => {
    setQuery(val);
    if (val.trim().length < 2) { setResults([]); return; }
    setSearching(true);
    try {
      const found = await searchAllPatients(val.trim());
      setResults(found);
    } catch {
      toast.error('Search failed');
    } finally {
      setSearching(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm) return;
    setDeleting(true);
    try {
      await deletePatient(confirm.id);
      toast.success(`${confirm.name} deleted`);
      setResults(r => r.filter(x => x.id !== confirm.id));
      setConfirm(null);
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal
      open={state.removeOpen}
      onClose={close}
      title="Remove Patient"
      subtitle="Search for a patient, then confirm deletion"
      maxWidth="max-w-lg"
    >
      <div className="p-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            autoFocus
            type="text"
            placeholder="Type name or diagnosis to search…"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
          />
          {searching && <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {results.map(p => (
              <div key={p.id} className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
                    <PaymentBadge type={p.paymentType} />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {p.diagnosisCategory} · {p.diagnosis} · {formatDate(p.visitDate)}
                  </p>
                  {(p.flags || []).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {p.flags.map(f => <FlagBadge key={f} flag={f} />)}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setConfirm(p)}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {query.length >= 2 && !searching && results.length === 0 && (
          <p className="text-center text-slate-400 text-sm py-4">No patients found for "{query}"</p>
        )}
      </div>

      {/* Confirmation overlay */}
      {confirm && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-8 text-center gap-4">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
            <AlertTriangle size={26} className="text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-lg">Delete this patient?</p>
            <p className="text-slate-500 text-sm mt-1">
              <span className="font-medium text-slate-700">{confirm.name}</span> — {confirm.diagnosis} — {formatDate(confirm.visitDate)}
            </p>
            <p className="text-red-500 text-xs mt-2 font-medium">This action cannot be undone.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setConfirm(null)}
              className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
              Cancel
            </button>
            <button onClick={handleDelete} disabled={deleting}
              className="px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-60">
              {deleting ? 'Deleting…' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
