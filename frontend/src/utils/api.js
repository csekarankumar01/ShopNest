let API_BASE_URL = process.env.REACT_APP_API_URL;

if (!API_BASE_URL) {
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    API_BASE_URL = 'https://shopnest-idbq.onrender.com';
  } else {
    API_BASE_URL = 'http://localhost:8000';
  }
}

API_BASE_URL = API_BASE_URL.replace(/\/$/, '');

export const apiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
