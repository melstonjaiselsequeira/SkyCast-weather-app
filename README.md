# SkyCast — MERN Weather Application

A full-stack weather app built with **MongoDB**, **Express**, **React**, and **Node.js**. Search any city, view current conditions and a 5-day forecast, save favorites, and browse recent searches stored in MongoDB.

## Features

- City search with autocomplete suggestions
- Current weather (temperature, humidity, wind, pressure, sunrise/sunset)
- 5-day forecast
- Geolocation (“use my location”)
- Favorite cities (stored in MongoDB)
- Recent search history (stored in MongoDB)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string
- Free API key from [OpenWeatherMap](https://openweathermap.org/api)

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/weather-app
OPENWEATHER_API_KEY=your_actual_api_key
```

Start the API:

```bash
npm run dev
```

### 2. Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
weather-app/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── controllers/          # Route handlers
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express routes
│   ├── services/             # OpenWeatherMap API client
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/       # React UI components
│       └── services/api.js   # Axios API client
└── README.md
```
##These are the files that implement SkyCast end to end:
```
Backend:
backend/server.js
backend/config/db.js
backend/controllers/weatherController.js
backend/models/Favorite.js, SearchHistory.js
backend/routes/weatherRoutes.js
backend/services/weatherService.js
Config you maintain: backend/package.json, backend/.gitignore, backend/.env.example
Local secrets only: backend/.env (you fill this in; don’t treat it as “source code” to share)

Frontend:
frontend/src/App.jsx
frontend/src/main.jsx
frontend/src/index.css
frontend/src/components/CurrentWeather.jsx, Forecast.jsx, SearchBar.jsx, Sidebar.jsx
frontend/src/services/api.js
Project config: frontend/package.json, frontend/vite.config.js, frontend/index.html, frontend/.gitignore

```
## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/weather/:city` | Current + forecast for city |
| GET | `/api/weather/coords?lat=&lon=` | Weather by coordinates |
| GET | `/api/weather/search?q=` | City autocomplete |
| GET | `/api/weather/history` | Recent searches |
| DELETE | `/api/weather/history` | Clear history |
| GET | `/api/weather/favorites` | List favorites |
| POST | `/api/weather/favorites` | Add favorite |
| DELETE | `/api/weather/favorites/:city` | Remove favorite |

## Tech Stack

- **MongoDB** + **Mongoose** — search history & favorites
- **Express** — REST API
- **React** + **Vite** — frontend
- **Axios** — HTTP client
- **OpenWeatherMap API** — weather data


