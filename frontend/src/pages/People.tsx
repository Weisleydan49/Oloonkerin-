import { useEffect, useState } from 'react';
import { Plus, Users, HardHat } from 'lucide-react';
import { 
  getDrivers, createDriver, type Driver, type DriverCreate,
  getSupervisors, createSupervisor, type Supervisor, type SupervisorCreate 
} from '../api/people';

export const People = () => {
  const [activeTab, setActiveTab] = useState<'drivers' | 'supervisors'>('drivers');
  
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [baseSalary, setBaseSalary] = useState('');

  const fetchData = async () => {
    try {
      const [driversData, supervisorsData] = await Promise.all([
        getDrivers(),
        getSupervisors()
      ]);
      setDrivers(driversData);
      setSupervisors(supervisorsData);
    } catch (error) {
      console.error("Failed to fetch staff data:", error);
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
      if (activeTab === 'drivers') {
        const newDriver: DriverCreate = {
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          license_number: licenseNumber,
          base_salary: parseFloat(baseSalary)
        };
        await createDriver(newDriver);
      } else {
        const newSupervisor: SupervisorCreate = {
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          base_salary: parseFloat(baseSalary)
        };
        await createSupervisor(newSupervisor);
      }
      
      setIsModalOpen(false);
      setFirstName('');
      setLastName('');
      setPhoneNumber('');
      setLicenseNumber('');
      setBaseSalary('');
      fetchData();
    } catch (error) {
      console.error(`Failed to create ${activeTab}:`, error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Supervisors & Drivers</h2>
          <p className="text-muted-foreground mt-1">Manage personnel, licenses, and base salaries.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add {activeTab === 'drivers' ? 'Driver' : 'Supervisor'}
        </button>
      </div>

      <div className="flex space-x-1 glass p-1 rounded-lg w-fit mb-6">
        <button
          onClick={() => setActiveTab('drivers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'drivers' ? 'bg-primary/20 text-primary shadow-sm' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4" />
          Drivers
        </button>
        <button
          onClick={() => setActiveTab('supervisors')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'supervisors' ? 'bg-primary/20 text-primary shadow-sm' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
          }`}
        >
          <HardHat className="w-4 h-4" />
          Supervisors
        </button>
      </div>

      <div className="glass rounded-xl border border-border/50 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border/50">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Phone</th>
              {activeTab === 'drivers' && <th className="px-6 py-4">License #</th>}
              <th className="px-6 py-4">Base Salary (KSH)</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : activeTab === 'drivers' && drivers.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No drivers found.</td></tr>
            ) : activeTab === 'supervisors' && supervisors.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No supervisors found.</td></tr>
            ) : (
              (activeTab === 'drivers' ? drivers : supervisors).map((person: any) => (
                <tr key={person.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30">
                  <td className="px-6 py-4 font-bold text-foreground">{person.first_name} {person.last_name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{person.phone_number}</td>
                  {activeTab === 'drivers' && <td className="px-6 py-4 font-medium font-mono text-primary">{person.license_number}</td>}
                  <td className="px-6 py-4 font-medium">KSH {person.base_salary.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${person.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {person.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="glass p-6 rounded-xl border border-border/50 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Add New {activeTab === 'drivers' ? 'Driver' : 'Supervisor'}</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input 
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-secondary border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input 
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-secondary border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input 
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-secondary border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                  placeholder="e.g. +254712345678" 
                />
              </div>

              {activeTab === 'drivers' && (
                <div>
                  <label className="block text-sm font-medium mb-1">License Number</label>
                  <input 
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full bg-secondary border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                    placeholder="e.g. DL-123456" 
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Base Salary (KSH)</label>
                <input 
                  type="number"
                  required
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(e.target.value)}
                  className="w-full bg-secondary border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                  placeholder="e.g. 40000" 
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
