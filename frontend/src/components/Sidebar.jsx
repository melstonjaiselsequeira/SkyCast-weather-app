import { iconUrl, clearHistory, removeFavorite } from '../services/api';

export default function Sidebar({
  history,
  favorites,
  onSelectCity,
  onRefresh,
}) {
  const handleClearHistory = async () => {
    await clearHistory();
    onRefresh();
  };

  const handleRemoveFavorite = async (city, e) => {
    e.stopPropagation();
    await removeFavorite(city);
    onRefresh();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-section card">
        <div className="sidebar-header">
          <h3>★ Favorites</h3>
        </div>
        {favorites.length === 0 ? (
          <p className="empty-msg">No favorites yet</p>
        ) : (
          <ul className="sidebar-list">
            {favorites.map((f) => (
              <li key={f._id} onClick={() => onSelectCity(f.city)}>
                <span>
                  {f.city}
                  {f.country && (
                    <span className="country-badge small">{f.country}</span>
                  )}
                </span>
                <button
                  className="remove-btn"
                  onClick={(e) => handleRemoveFavorite(f.city, e)}
                  title="Remove"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="sidebar-section card">
        <div className="sidebar-header">
          <h3>Recent Searches</h3>
          {history.length > 0 && (
            <button className="clear-btn" onClick={handleClearHistory}>
              Clear
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <p className="empty-msg">No search history</p>
        ) : (
          <ul className="sidebar-list history-list">
            {history.map((h) => (
              <li key={h._id} onClick={() => onSelectCity(h.city)}>
                <img src={iconUrl(h.icon)} alt="" />
                <span className="history-info">
                  <strong>{h.city}</strong>
                  <span>
                    {h.temperature}° · {h.description}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
