import { apiClient } from './client';

export interface FuelLog {
  id: string;
  date: string;
  vehicle_id: string;
  litres: number;
  cost_ksh: number;
  notes?: string;
  created_by_id: string;
  created_at: string;
}

export interface FuelLogCreate {
  date: string;
  vehicle_id: string;
  litres: number;
  cost_ksh: number;
  notes?: string;
}

export const getFuelLogs = async (): Promise<FuelLog[]> => {
  const { data } = await apiClient.get('/fuel/');
  return data;
};

export const createFuelLog = async (log: FuelLogCreate): Promise<FuelLog> => {
  const { data } = await apiClient.post('/fuel/', log);
  return data;
};

export const updateFuelLog = async (id: string, log: Partial<FuelLogCreate>): Promise<FuelLog> => {
  const { data } = await apiClient.put(`/fuel/${id}`, log);
  return data;
};

export const deleteFuelLog = async (id: string): Promise<void> => {
  await apiClient.delete(`/fuel/${id}`);
};
