import { apiClient } from './client';

export interface PayrollRecord {
  id: string;
  month: string;
  employee_id: string;
  employee_type: 'driver' | 'supervisor';
  basic_salary: number;
  allowances: number;
  sha: number;
  nssf: number;
  net_pay: number;
  created_at: string;
}

export interface PayrollRecordCreate {
  month: string;
  employee_id: string;
  employee_type: 'driver' | 'supervisor';
  basic_salary: number;
  allowances?: number;
  sha?: number;
  nssf?: number;
  net_pay: number;
}

export const getPayrollRecords = async (): Promise<PayrollRecord[]> => {
  const { data } = await apiClient.get('/payroll/');
  return data;
};

export const createPayrollRecord = async (record: PayrollRecordCreate): Promise<PayrollRecord> => {
  const { data } = await apiClient.post('/payroll/', record);
  return data;
};

export const updatePayrollRecord = async (id: string, record: Partial<PayrollRecordCreate>): Promise<PayrollRecord> => {
  const { data } = await apiClient.put(`/payroll/${id}`, record);
  return data;
};

export const deletePayrollRecord = async (id: string): Promise<void> => {
  await apiClient.delete(`/payroll/${id}`);
};
