import { createContext, useContext, useReducer, useCallback } from 'react';

const AppContext = createContext(null);

const now = new Date();

const initialState = {
  // Month navigation
  currentMonth: now.getMonth() + 1,
  currentYear:  now.getFullYear(),

  // Patient data (from Firestore)
  patients: [],
  loading: true,

  // Filters
  search:          '',
  filterCategory:  '',
  filterPayment:   '',
  filterFlag:      '',

  // Modal states
  addEditOpen:     false,
  editingPatient:  null,   // null = new patient mode
  removeOpen:      false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PATIENTS':
      return { ...state, patients: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_MONTH':
      return { ...state, currentMonth: action.payload, loading: true };
    case 'SET_YEAR':
      return { ...state, currentYear: action.payload, loading: true };
    case 'SET_SEARCH':
      return { ...state, search: action.payload };
    case 'SET_FILTER_CATEGORY':
      return { ...state, filterCategory: action.payload };
    case 'SET_FILTER_PAYMENT':
      return { ...state, filterPayment: action.payload };
    case 'SET_FILTER_FLAG':
      return { ...state, filterFlag: action.payload };
    case 'CLEAR_FILTERS':
      return { ...state, search: '', filterCategory: '', filterPayment: '', filterFlag: '' };
    case 'OPEN_ADD':
      return { ...state, addEditOpen: true, editingPatient: null };
    case 'OPEN_EDIT':
      return { ...state, addEditOpen: true, editingPatient: action.payload };
    case 'CLOSE_ADD_EDIT':
      return { ...state, addEditOpen: false, editingPatient: null };
    case 'OPEN_REMOVE':
      return { ...state, removeOpen: true };
    case 'CLOSE_REMOVE':
      return { ...state, removeOpen: false };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const navigateMonth = useCallback((dir) => {
    let m = state.currentMonth + dir;
    let y = state.currentYear;
    if (m < 1)  { m = 12; y -= 1; }
    if (m > 12) { m = 1;  y += 1; }
    dispatch({ type: 'SET_MONTH', payload: m });
    dispatch({ type: 'SET_YEAR',  payload: y });
  }, [state.currentMonth, state.currentYear]);

  // Computed: filtered patients
  const filteredPatients = state.patients.filter(p => {
    const q = state.search.toLowerCase();
    const matchSearch = !q ||
      p.name?.toLowerCase().includes(q) ||
      p.diagnosis?.toLowerCase().includes(q) ||
      p.diagnosisCategory?.toLowerCase().includes(q) ||
      p.referringDoctor?.toLowerCase().includes(q) ||
      p.id?.toLowerCase().includes(q);
    const matchCat  = !state.filterCategory || p.diagnosisCategory === state.filterCategory;
    const matchPay  = !state.filterPayment  || p.paymentType === state.filterPayment;
    const matchFlag = !state.filterFlag     || (p.flags || []).includes(state.filterFlag);
    return matchSearch && matchCat && matchPay && matchFlag;
  });

  return (
    <AppContext.Provider value={{ state, dispatch, filteredPatients, navigateMonth }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
