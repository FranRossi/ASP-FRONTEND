import { baseUrl } from '../baseService';

export const createPurchase = async (url, data, companyId) => {
  const completeUrl = baseUrl + url;
  const response = await fetch(completeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'company-id': companyId,
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
};
