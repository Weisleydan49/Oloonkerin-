import { apiClient } from './client';

export const login = async (username: string, password: string):Promise<{access_token: string, token_type: string}> => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const { data } = await apiClient.post('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return data;
};
