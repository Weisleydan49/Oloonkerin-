import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { FuelLogs } from './pages/FuelLogs';
import { Vehicles } from './pages/Vehicles';
import { Maintenance } from './pages/Maintenance';
import { People } from './pages/People';
import { Payroll } from './pages/Payroll';
import { Login } from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes wrapped in AdminLayout */}
        <Route 
          path="*" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/vehicles" element={<Vehicles />} />
                  <Route path="/fuel" element={<FuelLogs />} />
                  <Route path="/maintenance" element={<Maintenance />} />
                  <Route path="/people" element={<People />} />
                  <Route path="/payroll" element={<Payroll />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
