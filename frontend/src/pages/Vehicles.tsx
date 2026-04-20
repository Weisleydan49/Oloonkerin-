import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { getVehicles, createVehicle, type Vehicle, type VehicleCreate } from '../api/vehicles';

export const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [type, setType] = useState('truck');
  const [plateNumber, setPlateNumber] = useState('');
  const [makeModel, setMakeModel] = useState('');
  const [year, setYear] = useState('');

  const fetchVehicles = async () => {
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newVehicle: VehicleCreate = { 
        type, 
        plate_number: plateNumber, 
        make_model: makeModel, 
        year: year || undefined 
      };
      await createVehicle(newVehicle);
      setIsModalOpen(false);
      setType('truck');
      setPlateNumber('');
      setMakeModel('');
      setYear('');
      fetchVehicles();
    } catch (error) {
      console.error("Failed to create vehicle:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Vehicles & Machinery</h2>
          <p className="text-muted-foreground mt-1">Manage all physical assets, trucks, and heavy machinery.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Vehicle
        </button>
      </div>

      <div className="glass rounded-xl border border-border/50 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border/50">
            <tr>
              <th className="px-6 py-4">Plate / ID</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Make & Model</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Added</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : vehicles.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No vehicles found.</td></tr>
            ) : (
              vehicles.map((v) => (
                <tr key={v.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30">
                  <td className="px-6 py-4 font-bold text-primary">{v.plate_number}</td>
                  <td className="px-6 py-4">
                    <span className="bg-secondary px-2.5 py-1 rounded-md text-xs font-medium">
                      {v.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{v.make_model} {v.year ? `(${v.year})` : ''}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${v.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {v.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(v.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="glass p-6 rounded-xl border border-border/50 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Add New Asset</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Asset Type</label>
                <select 
                  required
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-secondary border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="truck">Truck</option>
                  <option value="excavator">Excavator</option>
                  <option value="bulldozer">Bulldozer</option>
                  <option value="grader">Grader</option>
                  <option value="loader">Loader</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Plate Number / ID</label>
                <input 
                  required
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  className="w-full bg-secondary border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary uppercase" 
                  placeholder="e.g. KCD 123X" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Make & Model</label>
                <input 
                  required
                  value={makeModel}
                  onChange={(e) => setMakeModel(e.target.value)}
                  className="w-full bg-secondary border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                  placeholder="e.g. Isuzu FVR" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Year (Optional)</label>
                <input 
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-secondary border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                  placeholder="e.g. 2022" 
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
                  Add Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
