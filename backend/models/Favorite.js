const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, trim: true, unique: true },
    country: { type: String, default: '' },
    lat: Number,
    lon: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Favorite', favoriteSchema);
