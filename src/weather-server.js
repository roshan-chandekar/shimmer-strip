// Weather API client — Open-Meteo (free, no API key needed!)
// Location comes from src/config.js (Chandrapur by default), or the
// WEATHER_LAT / WEATHER_LON / WEATHER_PLACE env vars (e.g. for Hyderabad weeks).
// Supports today and tomorrow forecasts for evening outfit planning
import { WEATHER_LATITUDE, WEATHER_LONGITUDE, WEATHER_TIMEZONE, WEATHER_PLACE } from './config.js';

const LATITUDE = Number(process.env.WEATHER_LAT || WEATHER_LATITUDE);
const LONGITUDE = Number(process.env.WEATHER_LON || WEATHER_LONGITUDE);

// Temperature bands tuned for central India rather than the UK original
// (which called anything over 25C "Hot").
const HOT_C = 32, WARM_C = 26, MILD_C = 20, LAYERS_BELOW_C = 18, COAT_BELOW_C = 12;
const RAINY_CHANCE = 60;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

let cache = null;
let cacheTime = 0;

const WMO_CODES = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Rime fog",
  51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
  61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
  71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
  80: "Slight showers", 81: "Moderate showers", 82: "Heavy showers",
  85: "Slight snow showers", 86: "Heavy snow showers",
  95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Severe thunderstorm",
};

function suggestedTag(temp, rainLikely = false) {
  // Monsoon days: rain decides the outfit more than temperature does.
  if (rainLikely) return "Rainy";
  return temp >= HOT_C ? "Hot" : temp >= WARM_C ? "Warm" : temp >= MILD_C ? "Mild" : "Cold";
}

async function fetchForecast() {
  if (cache && Date.now() - cacheTime < CACHE_TTL) return cache;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=temperature_2m,apparent_temperature,rain,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=${encodeURIComponent(WEATHER_TIMEZONE)}&forecast_days=2`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    cache = data;
    cacheTime = Date.now();
    return data;
  } catch (err) {
    console.error("Weather fetch failed:", err.message);
    if (cache) return cache;
    return null;
  }
}

function buildDayForecast(d, dayIndex, label) {
  const high = d.temperature_2m_max[dayIndex];
  const low = d.temperature_2m_min[dayIndex];
  const avg = (high + low) / 2;
  const code = d.weather_code[dayIndex];
  const rainChance = d.precipitation_probability_max[dayIndex];

  return {
    day: label,
    high, low,
    description: WMO_CODES[code] || "Unknown",
    weatherCode: code,
    rainChance,
    isRaining: code >= 51 && code < 90,
    isCold: avg < MILD_C,
    isMild: avg >= MILD_C && avg < WARM_C,
    isWarm: avg >= WARM_C && avg < HOT_C,
    isHot: avg >= HOT_C,
    needsLayers: avg < LAYERS_BELOW_C,
    needsCoat: avg < COAT_BELOW_C || (code >= 61 && code < 90),
    suggestedWeatherTag: suggestedTag(avg, (code >= 51 && code < 90) || rainChance >= RAINY_CHANCE),
    summary: `${label}: ${Math.round(high)}°/${Math.round(low)}° — ${(WMO_CODES[code] || "").toLowerCase()}.${rainChance > 30 ? ` ${rainChance}% chance of rain.` : ""}`,
  };
}

export async function getWeather(day = "today") {
  const data = await fetchForecast();
  if (!data) return null;

  const c = data.current;
  const d = data.daily;

  if (day === "tomorrow" && d.temperature_2m_max.length >= 2) {
    return buildDayForecast(d, 1, "tomorrow");
  }

  // Today: use current conditions + daily forecast
  return {
    day: "today",
    temperature: c.temperature_2m,
    feelsLike: c.apparent_temperature,
    description: WMO_CODES[c.weather_code] || "Unknown",
    weatherCode: c.weather_code,
    rain: c.rain,
    windSpeed: c.wind_speed_10m,
    high: d.temperature_2m_max[0],
    low: d.temperature_2m_min[0],
    rainChance: d.precipitation_probability_max[0],
    isRaining: c.rain > 0 || c.weather_code >= 51,
    isCold: c.temperature_2m < MILD_C,
    isMild: c.temperature_2m >= MILD_C && c.temperature_2m < WARM_C,
    isWarm: c.temperature_2m >= WARM_C && c.temperature_2m < HOT_C,
    isHot: c.temperature_2m >= HOT_C,
    needsLayers: c.temperature_2m < LAYERS_BELOW_C,
    needsCoat: c.temperature_2m < COAT_BELOW_C || (c.weather_code >= 61 && c.weather_code < 90),
    suggestedWeatherTag: suggestedTag(c.temperature_2m, c.rain > 0 || (c.weather_code >= 51 && c.weather_code < 90) || d.precipitation_probability_max[0] >= RAINY_CHANCE),
    summary: `${Math.round(c.temperature_2m)}° in ${WEATHER_PLACE} — ${(WMO_CODES[c.weather_code] || "").toLowerCase()}. Feels like ${Math.round(c.apparent_temperature)}°. High ${Math.round(d.temperature_2m_max[0])}°, low ${Math.round(d.temperature_2m_min[0])}°.${d.precipitation_probability_max[0] > 30 ? ` ${d.precipitation_probability_max[0]}% chance of rain.` : ""}`,
    // Include tomorrow's forecast for reference
    tomorrow: d.temperature_2m_max.length >= 2 ? buildDayForecast(d, 1, "tomorrow") : null,
  };
}
