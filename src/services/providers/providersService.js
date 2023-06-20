import { baseUrl } from '../baseService';

export const deleteProvider = async (url, id, companyId) => {
  const completeUrl = baseUrl + url + id;
  const response = await fetch(completeUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'company-id': companyId,
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  const result = await response.json();
  return result;
};

export const createProvider = async (url, data, companyId) => {
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

export const editProvider = async (url, id, data, companyId) => {
  const completeUrl = baseUrl + url + id;
  const response = await fetch(completeUrl, {
    method: 'PATCH',
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
