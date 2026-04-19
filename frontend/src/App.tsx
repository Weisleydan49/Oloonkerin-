
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { FuelLogs } from './pages/FuelLogs';
import { Vehicles } from './pages/Vehicles';
import { Maintenance } from './pages/Maintenance';
import { People } from './pages/People';
import { Payroll } from './pages/Payroll';

function App() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/fuel" element={<FuelLogs />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/people" element={<People />} />
        <Route path="/payroll" element={<Payroll />} />
      </Routes>
    </AdminLayout>
  );
}

export default App;
