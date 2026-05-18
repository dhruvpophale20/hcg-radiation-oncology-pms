import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2, ChevronUp, ChevronDown, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { deletePatient } from '../../firebase/patientService';
import FlagBadge from '../common/FlagBadge';
import PaymentBadge from '../common/PaymentBadge';
import toast from 'react-hot-toast';

function formatDate(d) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

export default function PatientTable() {
  const { state, dispatch, filteredPatients } = useApp();
  const { loading } = state;
  const [sortKey, setSortKey]   = useState('visitDate');
  const [sortDir, setSortDir]   = useState('desc');
  const [deleting, setDeleting] = useState(null); // id being deleted

  const handleSort = (key) => {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = [...filteredPatients].sort((a, b) => {
    const av = a[sortKey] ?? '';
    const bv = b[sortKey] ?? '';
    return sortDir === 'asc' ? av.localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });

  const handleDelete = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setDeleting(p.id);
    try {
      await deletePatient(p.id);
      toast.success(`${p.name} removed`);
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ChevronUp size={12} className="text-slate-300" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-brand-500" />
      : <ChevronDown size={12} className="text-brand-500" />;
  };

  const Th = ({ label, col, className = '' }) => (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-700 ${className}`}
      onClick={() => col && handleSort(col)}
    >
      <span className="flex items-center gap-1">
        {label} {col && <SortIcon col={col} />}
      </span>
    </th>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className="p-8 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 bg-slate-50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-16 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-4">
          <Users size={28} className="text-brand-400" />
        </div>
        <p className="text-slate-700 font-semibold font-heading text-lg">No patients found</p>
        <p className="text-slate-400 text-sm mt-1">Add a patient or adjust your filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-slate-100 bg-slate-50/60">
            <tr>
              <Th label="#" className="w-10" />
              <Th label="Patient"    col="name" />
              <Th label="Age / Sex"  col="age" />
              <Th label="Diagnosis"  col="diagnosisCategory" />
              <Th label="Payment"    col="paymentType" />
              <Th label="Referring Dr." col="referringDoctor" />
              <Th label="Date"       col="visitDate" />
              <Th label="Flags" />
              <th className="px-4 py-3 w-20" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AnimatePresence initial={false}>
              {sorted.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="group hover:bg-brand-50/40 transition-colors"
                >
                  <td className="px-4 py-3 text-xs text-slate-400 font-medium">{i + 1}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-slate-800 leading-none">{p.name}</p>
                    {p.contact && <p className="text-xs text-slate-400 mt-0.5">{p.contact}</p>}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {p.age} / {p.gender?.charAt(0) || '?'}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-semibold text-brand-600 leading-none">{p.diagnosisCategory}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-tight">{p.diagnosis}</p>
                  </td>
                  <td className="px-4 py-3">
                    <PaymentBadge type={p.paymentType} />
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{p.referringDoctor || '—'}</td>
                  <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">{formatDate(p.visitDate)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(p.flags || []).map(f => <FlagBadge key={f} flag={f} />)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => dispatch({ type: 'OPEN_EDIT', payload: p })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        disabled={deleting === p.id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2.5 border-t border-slate-50 text-xs text-slate-400">
        Showing {sorted.length} {sorted.length === 1 ? 'patient' : 'patients'}
        {sorted.length !== state.patients.length && ` (filtered from ${state.patients.length})`}
      </div>
    </div>
  );
}
