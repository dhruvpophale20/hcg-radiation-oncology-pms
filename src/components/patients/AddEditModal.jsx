import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import DiagnosisSelector from '../common/DiagnosisSelector';
import { useApp } from '../../context/AppContext';
import { addPatient, updatePatient } from '../../firebase/patientService';
import { PAYMENT_TYPES, GENDERS, PATIENT_FLAGS } from '../../utils/constants';
import toast from 'react-hot-toast';

const EMPTY = {
  name: '', age: '', gender: 'Male', visitDate: new Date().toISOString().slice(0, 10),
  diagnosisCategory: '', diagnosis: '', paymentType: 'Cash',
  referringDoctor: '', contact: '', flags: [], notes: '',
};

export default function AddEditModal() {
  const { state, dispatch } = useApp();
  const { addEditOpen, editingPatient, currentMonth, currentYear } = state;
  const isEdit = !!editingPatient;

  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (addEditOpen) {
      setForm(editingPatient ? { ...EMPTY, ...editingPatient } : EMPTY);
    }
  }, [addEditOpen, editingPatient]);

  const close = () => dispatch({ type: 'CLOSE_ADD_EDIT' });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleFlag = (fid) => {
    setForm(f => ({
      ...f,
      flags: f.flags.includes(fid) ? f.flags.filter(x => x !== fid) : [...f.flags, fid],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Patient name is required');
    if (!form.diagnosisCategory) return toast.error('Please select a diagnosis category');
    if (!form.diagnosis) return toast.error('Please select a diagnosis');
    if (!form.age || form.age < 1) return toast.error('Please enter a valid age');

    setSaving(true);
    try {
      const payload = {
        ...form,
        age: Number(form.age),
        month: currentMonth,
        year: currentYear,
      };
      if (isEdit) {
        await updatePatient(editingPatient.id, payload);
        toast.success('Patient updated');
      } else {
        await addPatient(payload);
        toast.success(`${form.name} added`);
      }
      close();
    } catch (err) {
      toast.error('Save failed — check your Firebase connection');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, required, children }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );

  const inputCls = "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition placeholder:text-slate-300";

  return (
    <Modal
      open={addEditOpen}
      onClose={close}
      title={isEdit ? 'Edit Patient' : 'Add New Patient'}
      subtitle={isEdit ? `Editing: ${editingPatient?.name}` : 'Fill in the patient details below'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit}>
        <div className="p-4 sm:p-6 space-y-5">
          {/* Name */}
          <Field label="Full Name" required>
            <input type="text" placeholder="e.g. Ramesh Patel" value={form.name}
              onChange={e => set('name', e.target.value)} className={inputCls} required />
          </Field>

          {/* Age + Gender + Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Age" required>
              <input type="number" min="1" max="120" placeholder="e.g. 58" value={form.age}
                onChange={e => set('age', e.target.value)} className={inputCls} required />
            </Field>
            <Field label="Gender" required>
              <select value={form.gender} onChange={e => set('gender', e.target.value)} className={inputCls}>
                {GENDERS.map(g => <option key={g}>{g}</option>)}
              </select>
            </Field>
            <Field label="Visit Date" required>
              <input type="date" value={form.visitDate}
                onChange={e => set('visitDate', e.target.value)} className={inputCls} required />
            </Field>
          </div>

          {/* Diagnosis */}
          <DiagnosisSelector
            category={form.diagnosisCategory}
            diagnosis={form.diagnosis}
            onCategoryChange={v => set('diagnosisCategory', v)}
            onDiagnosisChange={v => set('diagnosis', v)}
          />

          {/* Payment + Referring Dr + Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Payment Type" required>
              <select value={form.paymentType} onChange={e => set('paymentType', e.target.value)} className={inputCls}>
                {PAYMENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Referring Doctor">
              <input type="text" placeholder="Dr. Sharma" value={form.referringDoctor}
                onChange={e => set('referringDoctor', e.target.value)} className={inputCls} />
            </Field>
            <Field label="Contact No.">
              <input type="tel" placeholder="9876543210" value={form.contact}
                onChange={e => set('contact', e.target.value)} className={inputCls} />
            </Field>
          </div>

          {/* Flags */}
          <Field label="Patient Flags">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PATIENT_FLAGS.map(f => (
                <label
                  key={f.id}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition select-none
                    ${form.flags.includes(f.id)
                      ? 'bg-brand-50 border-brand-200 text-brand-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <input
                    type="checkbox"
                    className="accent-brand-600"
                    checked={form.flags.includes(f.id)}
                    onChange={() => toggleFlag(f.id)}
                  />
                  <span className="text-sm font-medium">{f.label}</span>
                </label>
              ))}
            </div>
          </Field>

          {/* Notes */}
          <Field label="Notes">
            <textarea rows={2} placeholder="Clinical notes, special instructions…" value={form.notes}
              onChange={e => set('notes', e.target.value)}
              className={`${inputCls} resize-none`} />
          </Field>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
          <button type="button" onClick={close}
            className="px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-100 transition">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="px-5 py-2 text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition disabled:opacity-60 disabled:cursor-not-allowed">
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Patient'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
