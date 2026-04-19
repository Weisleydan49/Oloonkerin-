import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { getMaintenanceLogs, createMaintenanceLog, type MaintenanceLog, type MaintenanceLogCreate } from '../api/maintenance';
import { getVehicles, type Vehicle } from '../api/vehicles';

export const Maintenance = () => {
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [vehicleId, setVehicleId] = useState('');
  const [description, setDescription] = useState('');
  const [costKsh, setCostKsh] = useState('');
  const [provider, setProvider] = useState('');

  const fetchData = async () => {
    try {
      const [logData, vehicleData] = await Promise.all([
        getMaintenanceLogs(),
        getVehicles()
      ]);
      setLogs(logData);
      setVehicles(vehicleData);
      if (vehicleData.length > 0 && !vehicleId) {
        setVehicleId(vehicleData[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch maintenance logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newLog: MaintenanceLogCreate = { 
        date: new Date(date).toISOString(),
        vehicle_id: vehicleId,
        description,
        cost_ksh: parseFloat(costKsh),
        provider: provider || undefined
      };
      await createMaintenanceLog(newLog);
      setIsModalOpen(false);
      setDescription('');
      setCostKsh('');
      setProvider('');
      fetchData();
    } catch (error) {
      console.error("Failed to create maintenance log:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Maintenance Logs</h2>
          <p className="text-muted-foreground mt-1">Track servicing, repairs, and associated costs.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Log Maintenance
        </button>
      </div>

      <div className="glass rounded-xl border border-border/50 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border/50">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Asset</th>
              <th className="px-6 py-4">Service Details</th>
              <th className="px-6 py-4">Provider</th>
              <th className="px-6 py-4">Cost (KSH)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No maintenance logs found.</td></tr>
            ) : (
              logs.map((log) => {
                const vehicle = vehicles.find(v => v.id === log.vehicle_id);
                return (
                  <tr key={log.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30">
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold text-primary whitespace-nowrap">
                      {vehicle ? vehicle.plate_number : log.vehicle_id}
                    </td>
                    <td className="px-6 py-4">{log.description}</td>
                    <td className="px-6 py-4 text-muted-foreground">{log.provider || '-'}</td>
                    <td className="px-6 py-4 text-rose-500 font-medium whitespace-nowrap">KSH {log.cost_ksh.toLocaleString()}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="glass p-6 rounded-xl border border-border/50 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Log Maintenance/Repair</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input 
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-secondary border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Total Cost (KSH)</label>
                  <input 
                    type="number"
                    required
                    value={costKsh}
                    onChange={(e) => setCostKsh(e.target.value)}
                    className="w-full bg-secondary border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                    placeholder="e.g. 15000" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Asset (Vehicle/Machine)</label>
                <select 
                  required
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full bg-secondary border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="" disabled>Select an asset</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.plate_number} - {v.make_model}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Service Details</label>
                <textarea 
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-secondary border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                  rows={3} 
                  placeholder="e.g. Changed engine oil, replaced filters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Provider / Mechanic (Optional)</label>
                <input 
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full bg-secondary border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                  placeholder="e.g. John Doe Autocare"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-md"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:opacity-90"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
