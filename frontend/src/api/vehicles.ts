import { apiClient } from './client';

export interface Vehicle {
  id: string;
  type: string;
  plate_number: string;
  make_model: string;
  year?: string;
  is_active: boolean;
  created_at: string;
}

export interface VehicleCreate {
  type: string;
  plate_number: string;
  make_model: string;
  year?: string;
}

export const getVehicles = async (): Promise<Vehicle[]> => {
  const { data } = await apiClient.get('/vehicles/');
  return data;
};

export const createVehicle = async (vehicle: VehicleCreate): Promise<Vehicle> => {
  const { data } = await apiClient.post('/vehicles/', vehicle);
  return data;
};

export const updateVehicle = async (id: string, vehicle: Partial<VehicleCreate>): Promise<Vehicle> => {
  const { data } = await apiClient.put(`/vehicles/${id}`, vehicle);
  return data;
};

export const deleteVehicle = async (id: string): Promise<void> => {
  await apiClient.delete(`/vehicles/${id}`);
};
