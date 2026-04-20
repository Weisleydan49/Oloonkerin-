import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getFuelLogs, createFuelLog, updateFuelLog, deleteFuelLog, type FuelLog, type FuelLogCreate } from '../api/fuel';
import { getVehicles, type Vehicle } from '../api/vehicles';

export const FuelLogs = () => {
  const [logs, setLogs] = useState<FuelLog[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [vehicleId, setVehicleId] = useState('');
  const [litresUsed, setLitresUsed] = useState('');
  const [costKsh, setCostKsh] = useState('');
  const [notes, setNotes] = useState('');

  const fetchData = async () => {
    try {
      const [fuelData, vehicleData] = await Promise.all([
        getFuelLogs(),
        getVehicles()
      ]);
      setLogs(fuelData);
      setVehicles(vehicleData);
      if (vehicleData.length > 0 && !vehicleId) {
        setVehicleId(vehicleData[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch fuel logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setVehicleId(vehicles.length > 0 ? vehicles[0].id : '');
    setLitresUsed('');
    setCostKsh('');
    setNotes('');
    setEditingId(null);
    setIsModalOpen(false);
  };

  const openEditModal = (log: FuelLog) => {
    setDate(log.date.split('T')[0]);
    setVehicleId(log.vehicle_id);
    setLitresUsed(log.litres.toString());
    setCostKsh(log.cost_ksh.toString());
    setNotes(log.notes || '');
    setEditingId(log.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this fuel log? This cannot be undone.')) return;
    try {
      await deleteFuelLog(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete fuel log:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<FuelLogCreate> = { 
        date: new Date(date).toISOString(),
        vehicle_id: vehicleId,
        litres: parseFloat(litresUsed),
        cost_ksh: parseFloat(costKsh),
        notes: notes || undefined
      };
      
      if (editingId) {
        await updateFuelLog(editingId, payload);
      } else {
        await createFuelLog(payload as FuelLogCreate);
      }
      
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Failed to save fuel log:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Fuel Logs</h2>
          <p className="text-muted-foreground mt-1">Track diesel consumption and costs across the fleet.</p>
        </div>
        <button 
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Fuel Log
        </button>
      </div>

      <div className="glass rounded-xl border border-border/50 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border/50">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Vehicle/Machine</th>
              <th className="px-6 py-4">Litres</th>
              <th className="px-6 py-4">Cost (KSH)</th>
              <th className="px-6 py-4">Notes</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No fuel logs found.</td></tr>
            ) : (
              logs.map((log) => {
                const vehicle = vehicles.find(v => v.id === log.vehicle_id);
                return (
                  <tr key={log.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30">
                    <td className="px-6 py-4 font-medium">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-primary">{vehicle ? `${vehicle.plate_number} (${vehicle.make_model})` : log.vehicle_id}</td>
                    <td className="px-6 py-4">{log.litres} L</td>
                    <td className="px-6 py-4 text-emerald-500 font-medium">KSH {log.cost_ksh.toLocaleString()}</td>
                    <td className="px-6 py-4 text-muted-foreground">{log.notes || '-'}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => openEditModal(log)}
                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(log.id)}
                        className="p-1.5 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
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
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Fuel Entry' : 'Add Fuel Entry'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-sm font-medium mb-1">Vehicle</label>
                <select 
                  required
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full bg-secondary border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="" disabled>Select a vehicle</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.plate_number} - {v.make_model}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Litres</label>
                  <input 
                    type="number"
                    step="0.1"
                    required
                    value={litresUsed}
                    onChange={(e) => setLitresUsed(e.target.value)}
                    className="w-full bg-secondary border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                    placeholder="e.g. 50" 
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
                    placeholder="e.g. 8500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-secondary border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                  rows={2} 
                  placeholder="e.g. Bulk diesel from site tank"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-md"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:opacity-90"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
