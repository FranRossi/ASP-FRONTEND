import { login } from 'src/sections/auth/auth';
import { baseUrl } from '../baseService';

export const createInvitation = async (url, data, companyId) => {
  const completeUrl = baseUrl + url;
  const response = await fetch(completeUrl, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'company-id': companyId,
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  const result = await response.json();
  return result;
};

export const acceptInvitation = async (url, data, companyId) => {
  const completeUrl = baseUrl + url;
  const response = await fetch(completeUrl, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'company-id': companyId,
    },
  });
  const result = await response.json();
    try {
      const loginResult = await login(data.email, data.password);
      await Promise.resolve();
      return { loginResult };
    } catch (error) {
      return error
    }
};
