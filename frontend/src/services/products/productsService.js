import { baseUrl } from '../baseService';

export const deleteProduct = async (url, id, companyId) => {
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

export const createProduct = async (url, data, companyId, image) => {
  const completeUrl = baseUrl + url;
  const formData = new FormData();
  formData.append('image', image);
  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('price', data.price);
  formData.append('stock', data.stock);

  const response = await fetch(completeUrl, {
    method: 'POST',
    headers: {
      'company-id': companyId,
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: formData,
  });

  const result = await response.json();
  return result;
};

export const editProduct = async (url, id, data, companyId) => {
  const completeUrl = baseUrl + url + id;
  const info = JSON.stringify(data);
  const response = await fetch(completeUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'company-id': companyId,
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: info,
  });
  const result = await response.json();
  return result;
};


export const manageSubscriptionToProduct = async (url, productId, companyId, email) => {
  //add query params to completeUrl
  const completeUrl = baseUrl + url + '?productId=' +productId + '&userEmail=' + email;
  const response = await fetch(completeUrl, {
    method: 'POST',
    headers: {
      'company-id': companyId,
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });

  const result = await response.json();
  return result;
} 

export const notifyStock = async (url, productId, companyId) => {
  const completeUrl = baseUrl + url + productId;
  const response = await fetch(completeUrl, {
    method: 'POST',
    headers: {
      'company-id': companyId,
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });

  const result = await response.json();
  return result;
}