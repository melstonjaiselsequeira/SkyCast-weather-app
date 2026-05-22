import { useState, useEffect, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import Sidebar from './components/Sidebar';
import {
  getWeather,
  getWeatherByCoords,
  getHistory,
  getFavorites,
} from './services/api';

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const loadSidebar = useCallback(async () => {
    try {
      const [histRes, favRes] = await Promise.all([getHistory(), getFavorites()]);
      setHistory(histRes.data);
      setFavorites(favRes.data);
    } catch {
      /* sidebar data is optional */
    }
  }, []);

  useEffect(() => {
    loadSidebar();
  }, [loadSidebar]);

  const fetchWeather = async (city) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getWeather(city);
      setWeather(data);
      loadSidebar();
    } catch (err) {
      setWeather(null);
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const fetchByCoords = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const { data } = await getWeatherByCoords(latitude, longitude);
          setWeather(data);
          loadSidebar();
        } catch (err) {
          setWeather(null);
          setError(err.response?.data?.message || 'Failed to get local weather');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Location access denied');
        setLoading(false);
      }
    );
  };

  const isFavorite =
    weather?.current &&
    favorites.some(
      (f) => f.city.toLowerCase() === weather.current.city.toLowerCase()
    );

  return (
    <div className="app">
      <div className="bg-gradient" />
      <header className="header">
        <div className="logo">
          <span className="logo-icon">☁</span>
          <h1>SkyCast</h1>
        </div>
        <p className="tagline">Real-time weather, powered by MERN</p>
      </header>

      <SearchBar
        onSearch={fetchWeather}
        onLocate={fetchByCoords}
        loading={loading}
      />

      {error && <div className="error-banner">{error}</div>}

      {loading && (
        <div className="loader">
          <div className="spinner" />
          <p>Fetching weather...</p>
        </div>
      )}

      {!loading && weather && (
        <main className="main-content">
          <CurrentWeather
            data={weather.current}
            isFavorite={isFavorite}
            onFavoriteChange={loadSidebar}
          />
          <Forecast days={weather.forecast} />
        </main>
      )}

      {!loading && !weather && !error && (
        <div className="welcome">
          <p>Search for a city or use your location to get started.</p>
        </div>
      )}

      <Sidebar
        history={history}
        favorites={favorites}
        onSelectCity={fetchWeather}
        onRefresh={loadSidebar}
      />
    </div>
  );
}

export default App;
