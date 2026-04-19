
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { FuelLogs } from './pages/FuelLogs';

function App() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/vehicles" element={<div className="p-6"><h2 className="text-2xl font-bold">Vehicles & Machinery</h2></div>} />
        <Route path="/fuel" element={<FuelLogs />} />
        <Route path="/maintenance" element={<div className="p-6"><h2 className="text-2xl font-bold">Maintenance</h2></div>} />
        <Route path="/people" element={<div className="p-6"><h2 className="text-2xl font-bold">Supervisors & Drivers</h2></div>} />
        <Route path="/payroll" element={<div className="p-6"><h2 className="text-2xl font-bold">Payroll</h2></div>} />
      </Routes>
    </AdminLayout>
  );
}

export default App;
