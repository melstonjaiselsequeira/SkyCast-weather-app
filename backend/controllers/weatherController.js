const SearchHistory = require('../models/SearchHistory');
const Favorite = require('../models/Favorite');
const weatherService = require('../services/weatherService');

const handleWeatherError = (res, err) => {
  const status = err.response?.status;
  if (status === 404) {
    return res.status(404).json({ message: 'City not found. Try another search.' });
  }
  if (status === 401) {
    return res.status(401).json({
      message:
        'Invalid OpenWeather API key. Sign up at openweathermap.org, add your key to backend/.env, then restart the server. New keys can take up to 2 hours to activate.',
    });
  }
  if (err.message?.includes('OPENWEATHER_API_KEY')) {
    return res.status(500).json({ message: err.message });
  }
  console.error(err.response?.data?.message || err.message);
  return res.status(500).json({ message: 'Failed to fetch weather data' });
};

exports.getWeather = async (req, res) => {
  try {
    const city = req.params.city;
    const [current, forecast] = await Promise.all([
      weatherService.fetchCurrentWeather(city),
      weatherService.fetchForecast(city),
    ]);

    await SearchHistory.create({
      city: current.city,
      country: current.country,
      temperature: current.temperature,
      description: current.description,
      icon: current.icon,
    });

    res.json({ current, forecast });
  } catch (err) {
    handleWeatherError(res, err);
  }
};

exports.getWeatherByCoords = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const [current, forecast] = await Promise.all([
      weatherService.fetchCurrentByCoords(lat, lon),
      weatherService.fetchForecastByCoords(lat, lon),
    ]);

    await SearchHistory.create({
      city: current.city,
      country: current.country,
      temperature: current.temperature,
      description: current.description,
      icon: current.icon,
    });

    res.json({ current, forecast });
  } catch (err) {
    handleWeatherError(res, err);
  }
};

exports.searchCities = async (req, res) => {
  try {
    const results = await weatherService.searchCities(req.query.q);
    res.json(results);
  } catch (err) {
    handleWeatherError(res, err);
  }
};

exports.getHistory = async (req, res) => {
  const history = await SearchHistory.find().sort({ createdAt: -1 }).limit(10);
  res.json(history);
};

exports.clearHistory = async (req, res) => {
  await SearchHistory.deleteMany({});
  res.json({ message: 'History cleared' });
};

exports.getFavorites = async (req, res) => {
  const favorites = await Favorite.find().sort({ createdAt: -1 });
  res.json(favorites);
};

exports.addFavorite = async (req, res) => {
  try {
    const { city, country, lat, lon } = req.body;
    const favorite = await Favorite.findOneAndUpdate(
      { city },
      { city, country, lat, lon },
      { upsert: true, new: true }
    );
    res.status(201).json(favorite);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.removeFavorite = async (req, res) => {
  await Favorite.findOneAndDelete({ city: req.params.city });
  res.json({ message: 'Removed from favorites' });
};
