import { iconUrl } from '../services/api';

const dayName = (dateStr) => {
  const date = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return 'Today';
  return date.toLocaleDateString([], { weekday: 'short' });
};

export default function Forecast({ days }) {
  if (!days?.length) return null;

  return (
    <section className="forecast card">
      <h3>5-Day Forecast</h3>
      <div className="forecast-row">
        {days.map((day) => (
          <div key={day.date} className="forecast-day">
            <span className="forecast-day-name">{dayName(day.date)}</span>
            <img src={iconUrl(day.icon)} alt={day.description} />
            <span className="forecast-desc">{day.description}</span>
            <span className="forecast-temps">
              <span className="temp-max">{day.tempMax}°</span>
              <span className="temp-min">{day.tempMin}°</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
