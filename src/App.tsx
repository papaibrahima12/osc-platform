import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/auth';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NGOManagerDashboard from './pages/NGOManagerDashboard';

function App() {
  const { user, loading, fetchProfile } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 5000,
            style: {
              background: '#059669',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#DC2626',
            },
          },
        }}
      />
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/" replace />} 
        />
        <Route
          path="/forgot-password"
          element={!user ? <ForgotPassword /> : <Navigate to="/" replace />}
        />
          <Route
              path="/reset-password"
              element=<ResetPassword/>
          />
        <Route
          path="/*"
          element={
            user ? (
              user.role === 'super_admin' ? (
                <SuperAdminDashboard />
              ) : user.role === 'admin' ? (
                <AdminDashboard />
              ) : (
                <NGOManagerDashboard />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;