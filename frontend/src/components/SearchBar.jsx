import { useState, useEffect, useRef } from 'react';
import { searchCities } from '../services/api';

export default function SearchBar({ onSearch, onLocate, loading }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await searchCities(query);
        setSuggestions(data);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const selectCity = (item) => {
    const label = item.state
      ? `${item.name}, ${item.state}, ${item.country}`
      : `${item.name}, ${item.country}`;
    setQuery(label);
    onSearch(item.name);
    setShowSuggestions(false);
  };

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search city (e.g. London, Tokyo)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !query.trim()}>
          Search
        </button>
        <button
          type="button"
          className="locate-btn"
          onClick={onLocate}
          disabled={loading}
          title="Use my location"
        >
          📍
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((item, i) => (
            <li key={i} onClick={() => selectCity(item)}>
              <strong>{item.name}</strong>
              {item.state && <span>, {item.state}</span>}
              <span className="country"> {item.country}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
