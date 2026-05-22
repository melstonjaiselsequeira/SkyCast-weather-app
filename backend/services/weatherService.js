const axios = require('axios');

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

const getApiKey = () => {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key || key === 'your_openweather_api_key_here') {
    throw new Error('OPENWEATHER_API_KEY is not configured. Add it to backend/.env');
  }
  return key;
};

const fetchCurrentWeather = async (city) => {
  const { data } = await axios.get(`${BASE_URL}/weather`, {
    params: { q: city, appid: getApiKey(), units: 'metric' },
  });
  return formatCurrent(data);
};

const fetchCurrentByCoords = async (lat, lon) => {
  const { data } = await axios.get(`${BASE_URL}/weather`, {
    params: { lat, lon, appid: getApiKey(), units: 'metric' },
  });
  return formatCurrent(data);
};

const fetchForecast = async (city) => {
  const { data } = await axios.get(`${BASE_URL}/forecast`, {
    params: { q: city, appid: getApiKey(), units: 'metric' },
  });
  return formatForecast(data);
};

const fetchForecastByCoords = async (lat, lon) => {
  const { data } = await axios.get(`${BASE_URL}/forecast`, {
    params: { lat, lon, appid: getApiKey(), units: 'metric' },
  });
  return formatForecast(data);
};

const searchCities = async (query) => {
  const { data } = await axios.get(`${GEO_URL}/direct`, {
    params: { q: query, limit: 5, appid: getApiKey() },
  });
  return data.map((item) => ({
    name: item.name,
    country: item.country,
    state: item.state || '',
    lat: item.lat,
    lon: item.lon,
  }));
};

const formatCurrent = (data) => ({
  city: data.name,
  country: data.sys.country,
  temperature: Math.round(data.main.temp),
  feelsLike: Math.round(data.main.feels_like),
  humidity: data.main.humidity,
  windSpeed: data.wind.speed,
  pressure: data.main.pressure,
  description: data.weather[0].description,
  icon: data.weather[0].icon,
  lat: data.coord.lat,
  lon: data.coord.lon,
  sunrise: data.sys.sunrise,
  sunset: data.sys.sunset,
});

const formatForecast = (data) => {
  const daily = {};
  data.list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!daily[date]) {
      daily[date] = {
        date,
        tempMin: item.main.temp_min,
        tempMax: item.main.temp_max,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      };
    } else {
      daily[date].tempMin = Math.min(daily[date].tempMin, item.main.temp_min);
      daily[date].tempMax = Math.max(daily[date].tempMax, item.main.temp_max);
    }
  });
  return Object.values(daily)
    .slice(0, 5)
    .map((d) => ({
      ...d,
      tempMin: Math.round(d.tempMin),
      tempMax: Math.round(d.tempMax),
    }));
};

module.exports = {
  fetchCurrentWeather,
  fetchCurrentByCoords,
  fetchForecast,
  fetchForecastByCoords,
  searchCities,
};
