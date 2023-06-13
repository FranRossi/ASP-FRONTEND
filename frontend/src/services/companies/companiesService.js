import { baseUrl } from '../baseService';

export const getCompany = async (url, companyId) => {
  const completeUrl = `${baseUrl}${url}?company-id=${companyId}`;
  const response = await fetch(completeUrl, {
    method: 'GET',
    headers: {
      'company-id': companyId,
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  const result = await response.json();
  return result;
};


export const getCompanyReport = async (url, companyId) => {
  const completeUrl = baseUrl + url;
  const response = await fetch(completeUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'company-id': companyId,
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  const result = await response.json();
  return result;
};