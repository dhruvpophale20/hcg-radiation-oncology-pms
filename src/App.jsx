
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import SignIn from './components/common/SignIn';

export default function App() {
  const [signedIn, setSignedIn] = useState(false);
  if (!signedIn) {
    return <SignIn onSignIn={() => setSignedIn(true)} />;
  }
  return (
    <AppProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '10px',
            background: '#1e293b',
            color: '#f1f5f9',
            fontSize: '13px',
            fontWeight: '500',
          },
        }}
      />
      <Dashboard />
    </AppProvider>
  );
}
