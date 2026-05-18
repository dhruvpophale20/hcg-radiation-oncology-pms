import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import StatsCards from '../components/dashboard/StatsCards';
import PatientTable from '../components/patients/PatientTable';
import SearchToolbar from '../components/filters/SearchToolbar';
import AddEditModal from '../components/patients/AddEditModal';
import RemoveModal from '../components/patients/RemoveModal';
import { usePatients } from '../hooks/usePatients';

export default function Dashboard() {
  usePatients();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(o => !o)} />

        <main className="flex-1 p-3 sm:p-5 space-y-4 overflow-auto">
          <StatsCards />
          <SearchToolbar />
          <PatientTable />
        </main>
      </div>

      <AddEditModal />
      <RemoveModal />
    </div>
  );
}
