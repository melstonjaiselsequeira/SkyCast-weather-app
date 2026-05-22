import { iconUrl, addFavorite, removeFavorite } from '../services/api';

export default function CurrentWeather({ data, isFavorite, onFavoriteChange }) {
  const formatTime = (unix) =>
    new Date(unix * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavorite(data.city);
      } else {
        await addFavorite({
          city: data.city,
          country: data.country,
          lat: data.lat,
          lon: data.lon,
        });
      }
      onFavoriteChange();
    } catch {
      /* ignore */
    }
  };

  return (
    <section className="current-weather card">
      <div className="current-header">
        <div>
          <h2>
            {data.city}
            <span className="country-badge">{data.country}</span>
          </h2>
          <p className="description">{data.description}</p>
        </div>
        <button
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={toggleFavorite}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>

      <div className="current-main">
        <img src={iconUrl(data.icon)} alt={data.description} />
        <div className="temp-block">
          <span className="temperature">{data.temperature}°</span>
          <span className="feels-like">Feels like {data.feelsLike}°C</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat">
          <span className="stat-label">Humidity</span>
          <span className="stat-value">{data.humidity}%</span>
        </div>
        <div className="stat">
          <span className="stat-label">Wind</span>
          <span className="stat-value">{data.windSpeed} m/s</span>
        </div>
        <div className="stat">
          <span className="stat-label">Pressure</span>
          <span className="stat-value">{data.pressure} hPa</span>
        </div>
        <div className="stat">
          <span className="stat-label">Sunrise</span>
          <span className="stat-value">{formatTime(data.sunrise)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Sunset</span>
          <span className="stat-value">{formatTime(data.sunset)}</span>
        </div>
      </div>
    </section>
  );
}
