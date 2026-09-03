const RETURN_TO_KEY = 'teachglass_auth_return_to';

export const setAuthReturnTo = (url) => {
  if (url) localStorage.setItem(RETURN_TO_KEY, url);
};

export const getAuthReturnTo = () => {
  return localStorage.getItem(RETURN_TO_KEY) || '/';
};

export const clearAuthReturnTo = () => {
  localStorage.removeItem(RETURN_TO_KEY);
};
