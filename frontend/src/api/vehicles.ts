import { apiClient } from './client';

export interface Vehicle {
  id: string;
  type: string;
  plate_number: string;
  make_model: string;
  year?: string;
  is_active: boolean;
}

export const getVehicles = async (): Promise<Vehicle[]> => {
  const { data } = await apiClient.get('/vehicles/');
  return data;
};
