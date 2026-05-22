const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema(
  {
    city: { type: String, required: true, trim: true },
    country: { type: String, default: '' },
    temperature: Number,
    description: String,
    icon: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
