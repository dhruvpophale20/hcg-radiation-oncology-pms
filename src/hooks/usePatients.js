import { useEffect } from 'react';
import { subscribePatients } from '../firebase/patientService';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

/**
 * Hook: subscribes to Firestore patients for the current month/year
 * and syncs them into AppContext.
 * Must be called once inside the component tree (Dashboard.jsx).
 */
export function usePatients() {
  const { state, dispatch } = useApp();
  const { currentMonth, currentYear } = state;

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });

    const unsub = subscribePatients(
      currentMonth,
      currentYear,
      (patients) => dispatch({ type: 'SET_PATIENTS', payload: patients }),
      (err) => {
        toast.error('Failed to load patients. Check Firebase config.');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    );

    return () => unsub();
  }, [currentMonth, currentYear, dispatch]);
}
