import { apiClient } from './client';

export interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  license_number: string;
  base_salary: number;
  is_active: boolean;
  created_at: string;
}

export interface DriverCreate {
  first_name: string;
  last_name: string;
  phone_number: string;
  license_number: string;
  base_salary: number;
}

export interface Supervisor {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  base_salary: number;
  is_active: boolean;
  created_at: string;
}

export interface SupervisorCreate {
  first_name: string;
  last_name: string;
  phone_number: string;
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
