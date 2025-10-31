export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('eventsnap_token');
  }
  return null;
};

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('eventsnap_token', token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('eventsnap_token');
  }
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};