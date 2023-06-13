import { baseUrl } from '../baseService';

export const getSales = async (companyId) => {
  fetch(baseUrl + 'sales/')
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getProductSales = async (url, companyId) => {
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

export const createSale = async (url, data, companyId) => {
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
