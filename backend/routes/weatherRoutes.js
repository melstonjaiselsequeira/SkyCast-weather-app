const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

router.get('/search', weatherController.searchCities);
router.get('/coords', weatherController.getWeatherByCoords);
router.get('/history', weatherController.getHistory);
router.delete('/history', weatherController.clearHistory);
router.get('/favorites', weatherController.getFavorites);
router.post('/favorites', weatherController.addFavorite);
router.delete('/favorites/:city', weatherController.removeFavorite);
router.get('/:city', weatherController.getWeather);

module.exports = router;
