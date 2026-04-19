import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<div className="p-6"><h2 className="text-2xl font-bold">Projects</h2></div>} />
        <Route path="/vehicles" element={<div className="p-6"><h2 className="text-2xl font-bold">Vehicles & Machinery</h2></div>} />
        <Route path="/fuel" element={<div className="p-6"><h2 className="text-2xl font-bold">Fuel Logs</h2></div>} />
        <Route path="/maintenance" element={<div className="p-6"><h2 className="text-2xl font-bold">Maintenance</h2></div>} />
        <Route path="/people" element={<div className="p-6"><h2 className="text-2xl font-bold">Supervisors & Drivers</h2></div>} />
        <Route path="/payroll" element={<div className="p-6"><h2 className="text-2xl font-bold">Payroll</h2></div>} />
      </Routes>
    </AdminLayout>
  );
}

export default App;
