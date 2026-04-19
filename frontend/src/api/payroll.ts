import { apiClient } from './client';

export interface PayrollRecord {
  id: string;
  date: string;
  staff_id: string;
  staff_type: 'driver' | 'supervisor';
  base_pay: number;
  allowances: number;
  deductions: number;
  net_pay: number;
  notes?: string;
  created_by_id: string;
  created_at: string;
}

export interface PayrollRecordCreate {
  date: string;
  staff_id: string;
  staff_type: 'driver' | 'supervisor';
  base_pay: number;
  allowances?: number;
  deductions?: number;
  notes?: string;
}

export const getPayrollRecords = async (): Promise<PayrollRecord[]> => {
  const { data } = await apiClient.get('/payroll/');
  return data;
};

export const createPayrollRecord = async (record: PayrollRecordCreate): Promise<PayrollRecord> => {
  const { data } = await apiClient.post('/payroll/', record);
  return data;
};
