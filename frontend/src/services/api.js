import axios from 'axios';

const api = axios.create({
  baseURL: '/api/weather',
});

export const getWeather = (city) => api.get(`/${encodeURIComponent(city)}`);
export const getWeatherByCoords = (lat, lon) =>
  api.get('/coords', { params: { lat, lon } });
export const searchCities = (q) => api.get('/search', { params: { q } });
export const getHistory = () => api.get('/history');
export const clearHistory = () => api.delete('/history');
export const getFavorites = () => api.get('/favorites');
export const addFavorite = (data) => api.post('/favorites', data);
export const removeFavorite = (city) =>
  api.delete(`/favorites/${encodeURIComponent(city)}`);

export const iconUrl = (icon) =>
  `https://openweathermap.org/img/wn/${icon}@2x.png`;
