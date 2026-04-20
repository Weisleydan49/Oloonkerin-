import { apiClient } from './client';

export interface Driver {
  id: string;
  full_name: string;
  phone: string;
  id_number: string;
  base_salary: number;
  is_active: boolean;
  created_at: string;
}

export interface DriverCreate {
  full_name: string;
  phone: string;
  id_number: string;
  base_salary: number;
}

export interface Supervisor {
  id: string;
  full_name: string;
  phone: string;
  base_salary: number;
  is_active: boolean;
  created_at: string;
}

export interface SupervisorCreate {
  full_name: string;
  phone: string;
  base_salary: number;
}

export const getDrivers = async (): Promise<Driver[]> => {
  const { data } = await apiClient.get('/drivers/');
  return data;
};

export const createDriver = async (driver: DriverCreate): Promise<Driver> => {
  const { data } = await apiClient.post('/drivers/', driver);
  return data;
};

export const getSupervisors = async (): Promise<Supervisor[]> => {
  const { data } = await apiClient.get('/supervisors/');
  return data;
};

export const createSupervisor = async (supervisor: SupervisorCreate): Promise<Supervisor> => {
  const { data } = await apiClient.post('/supervisors/', supervisor);
  return data;
};

export const updateDriver = async (id: string, driver: Partial<DriverCreate>): Promise<Driver> => {
  const { data } = await apiClient.put(`/drivers/${id}`, driver);
  return data;
};

export const deleteDriver = async (id: string): Promise<void> => {
  await apiClient.delete(`/drivers/${id}`);
};

export const updateSupervisor = async (id: string, supervisor: Partial<SupervisorCreate>): Promise<Supervisor> => {
  const { data } = await apiClient.put(`/supervisors/${id}`, supervisor);
  return data;
};

export const deleteSupervisor = async (id: string): Promise<void> => {
  await apiClient.delete(`/supervisors/${id}`);
};
