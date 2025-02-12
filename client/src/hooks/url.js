const API_URL = window.location.hostname === 'localhost'
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL_IP;

export default API_URL;