import { baseUrl } from '../baseService';

export const post = async (url, data) => {
  const completeUrl = baseUrl + url;
  const response = await fetch(completeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
};
