import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getPayrollRecords, createPayrollRecord, updatePayrollRecord, deletePayrollRecord, type PayrollRecord, type PayrollRecordCreate } from '../api/payroll';
import { getDrivers, type Driver, getSupervisors, type Supervisor } from '../api/people';

export const Payroll = () => {
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [staffId, setStaffId] = useState('');
  const [staffType, setStaffType] = useState<'driver' | 'supervisor'>('driver');
  const [basePay, setBasePay] = useState('');
  const [allowances, setAllowances] = useState('0');
  const [deductions, setDeductions] = useState('0');
  const [notes, setNotes] = useState('');

  const fetchData = async () => {
    try {
      const [payrollData, driversData, supervisorsData] = await Promise.all([
        getPayrollRecords(),
        getDrivers(),
        getSupervisors()
      ]);
      setRecords(payrollData);
      setDrivers(driversData);
      setSupervisors(supervisorsData);
    } catch (error) {
      console.error("Failed to fetch payroll data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStaffSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) return;
    
    const [type, id] = value.split(':::');
    setStaffType(type as 'driver' | 'supervisor');
    setStaffId(id);

    // Auto-fill base pay if available
    if (type === 'driver') {
      const d = drivers.find(drv => drv.id === id);
      if (d) setBasePay(d.base_salary.toString());
    } else {
      const s = supervisors.find(sup => sup.id === id);
      if (s) setBasePay(s.base_salary.toString());
    }
  };

  const resetForm = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setStaffId('');
    setStaffType('driver');
    setBasePay('');
    setAllowances('0');
    setDeductions('0');
    setNotes('');
    setEditingId(null);
    setIsModalOpen(false);
  };

  const openEditModal = (record: PayrollRecord) => {
    setDate(record.date.split('T')[0]);
    setStaffId(record.staff_id);
    setStaffType(record.staff_type);
    setBasePay(record.base_pay.toString());
    setAllowances(record.allowances.toString());
    setDeductions(record.deductions.toString());
    setNotes(record.notes || '');
    setEditingId(record.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this payroll record? This cannot be undone.')) return;
    try {
      await deletePayrollRecord(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete payroll record:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<PayrollRecordCreate> = { 
        date: new Date(date).toISOString(),
        staff_id: staffId,
        staff_type: staffType,
        base_pay: parseFloat(basePay),
        allowances: parseFloat(allowances || '0'),
        deductions: parseFloat(deductions || '0'),
        notes: notes || undefined
      };
      
      if (editingId) {
        await updatePayrollRecord(editingId, payload);
      } else {
        await createPayrollRecord(payload as PayrollRecordCreate);
      }
      
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Failed to save payroll record:", error);
    }
  };

  // Helper to resolve staff name from ID and Type
  const getStaffName = (id: string, type: string) => {
    if (type === 'driver') {
      const d = drivers.find(d => d.id === id);
      return d ? `${d.first_name} ${d.last_name}` : id;
    } else {
      const s = supervisors.find(s => s.id === id);
      return s ? `${s.first_name} ${s.last_name}` : id;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payroll & Financials</h2>
          <p className="text-muted-foreground mt-1">Process salaries, allowances, and statutory deductions.</p>
        </div>
        <button 
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Process Payment
        </button>
      </div>

      <div className="glass rounded-xl border border-border/50 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border/50">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Staff Member</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Base Pay</th>
              <th className="px-6 py-4">Net Payout (KSH)</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No payroll records found.</td></tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30">
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold text-foreground">
                    {getStaffName(record.staff_id, record.staff_type)}
                  </td>
                  <td className="px-6 py-4 capitalize text-muted-foreground">{record.staff_type}</td>
                  <td className="px-6 py-4 text-muted-foreground">{record.base_pay.toLocaleString()}</td>
                  <td className="px-6 py-4 text-emerald-500 font-medium whitespace-nowrap">KSH {record.net_pay.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => openEditModal(record)}
                      className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(record.id)}
                      className="p-1.5 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Payroll Entry' : 'Process Payroll Entry'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Payment Date</label>
                <input 
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-secondary border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Staff Member</label>
                <select 
                  required
                  value={`${staffType}:::${staffId}`}
                  onChange={handleStaffSelect}
                  className="w-full bg-secondary border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="driver:::" disabled>Select staff member</option>
                  <optgroup label="Drivers">
                    {drivers.map(d => (
                      <option key={d.id} value={`driver:::${d.id}`}>{d.first_name} {d.last_name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Supervisors">
                    {supervisors.map(s => (
                      <option key={s.id} value={`supervisor:::${s.id}`}>{s.first_name} {s.last_name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Base Pay (KSH)</label>
                  <input 
                    type="number"
                    required
                    value={basePay}
                    onChange={(e) => setBasePay(e.target.value)}
                    className="w-full bg-secondary border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Allowances (KSH)</label>
                  <input 
                    type="number"
                    value={allowances}
                    onChange={(e) => setAllowances(e.target.value)}
                    className="w-full bg-secondary border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-emerald-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Deductions (KSH)</label>
                  <input 
                    type="number"
                    value={deductions}
                    onChange={(e) => setDeductions(e.target.value)}
                    className="w-full bg-secondary border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-rose-500" 
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
                  placeholder="e.g. Overtime allowance + NHIF deduction"
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
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
