import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, query, where, onSnapshot,
  serverTimestamp, orderBy, getDocs, limit,
} from 'firebase/firestore';
import { db } from './config';

const COLLECTION = 'patients';

// ─── Real-time subscription ─────────────────────────────────────────────────
/**
 * Subscribe to patients for a given month/year.
 * Calls callback(patients[]) on every Firestore change.
 * Returns the unsubscribe function.
 */
export function subscribePatients(month, year, callback, onError) {
  const q = query(
    collection(db, COLLECTION),
    where('month', '==', month),
    where('year', '==', year),
  );
  return onSnapshot(q,
    (snap) => {
      const patients = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort by visitDate descending client-side (avoids composite index)
      patients.sort((a, b) => (b.visitDate || '').localeCompare(a.visitDate || ''));
      callback(patients);
    },
    (err) => {
      console.error('[Firestore]', err);
      onError?.(err);
    }
  );
}

// ─── CRUD ──────────────────────────────────────────────────────────────────
export async function addPatient(data) {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updatePatient(id, data) {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePatient(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}

// ─── Global search (for Remove modal) ─────────────────────────────────────
export async function searchAllPatients(queryStr) {
  const snap = await getDocs(
    query(collection(db, COLLECTION), orderBy('createdAt', 'desc'), limit(500))
  );
  const q = queryStr.toLowerCase().trim();
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(p =>
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.diagnosis?.toLowerCase().includes(q) ||
      p.diagnosisCategory?.toLowerCase().includes(q) ||
      p.referringDoctor?.toLowerCase().includes(q)
    );
}
