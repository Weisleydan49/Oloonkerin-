import { apiClient } from './client';

export interface MaintenanceLog {
  id: string;
  date: string;
  vehicle_id: string;
  description: string;
  cost_ksh: number;
  provider?: string;
  created_by_id: string;
  created_at: string;
}

export interface MaintenanceLogCreate {
  date: string;
  vehicle_id: string;
  description: string;
  cost_ksh: number;
  provider?: string;
}

export const getMaintenanceLogs = async (): Promise<MaintenanceLog[]> => {
  const { data } = await apiClient.get('/maintenance/');
  return data;
};

export const createMaintenanceLog = async (log: MaintenanceLogCreate): Promise<MaintenanceLog> => {
  const { data } = await apiClient.post('/maintenance/', log);
  return data;
};

export const updateMaintenanceLog = async (id: string, log: Partial<MaintenanceLogCreate>): Promise<MaintenanceLog> => {
  const { data } = await apiClient.put(`/maintenance/${id}`, log);
  return data;
};

export const deleteMaintenanceLog = async (id: string): Promise<void> => {
  await apiClient.delete(`/maintenance/${id}`);
};
