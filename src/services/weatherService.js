// src/services/weatherService.js

// Helper: Map OpenWeather conditions to app vibes + emoji
function mapWeatherToVibe(weatherMain) {
  if (!weatherMain) return { vibe: "CRISP & SUNNY", emoji: "☀️" };

  const main = weatherMain.toLowerCase();

  if (main.includes("clear")) return { vibe: "CRISP & SUNNY", emoji: "☀️" };
  if (main.includes("cloud") || main.includes("mist") || main.includes("fog"))
    return { vibe: "WINDY & BROODING", emoji: "🌫️" };
  if (main.includes("rain") || main.includes("drizzle"))
    return { vibe: "RAINY & COZY", emoji: "🌧️" };
  if (main.includes("storm") || main.includes("thunder"))
    return { vibe: "STORMY & DRAMATIC", emoji: "🌩️" };
  if (main.includes("snow"))
    return { vibe: "RAINY & COZY", emoji: "❄️" }; // you can create a new vibe later if you want

  return { vibe: "CRISP & SUNNY", emoji: "☀️" }; // fallback
}

export async function fetchWeather(lat, lon) {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Weather API request failed");
    }

    const data = await response.json();

    // Map to vibe + emoji
    const { vibe, emoji } = mapWeatherToVibe(data.weather[0]?.main);

    return {
      vibe,
      emoji,
      description: data.weather[0]?.description || "Unknown",
      temp: data.main?.temp,
      city: data.name,
      raw: data, // keep full API response
    };
  } catch (err) {
    console.error("Weather fetch error:", err);
    return null;
  }
}
