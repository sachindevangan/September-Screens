import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { fetchWeather } from "../services/weatherService";
import "./WeatherScreen.css";
import NavButtons from "../components/NavButtons";

// Helper: Map OpenWeatherMap → vibe + icon
function mapWeatherToChoice(weatherMain) {
  const lower = weatherMain.toLowerCase();
  if (lower.includes("clear")) return { choice: "CLEAR & CALM", icon: "☀️" };
  if (lower.includes("rain") || lower.includes("drizzle"))
    return { choice: "RAINY & COZY", icon: "🌧️" };
  if (
    lower.includes("cloud") ||
    lower.includes("mist") ||
    lower.includes("fog") ||
    lower.includes("haze") ||
    lower.includes("wind")
  )
    return { choice: "WINDY & BROODING", icon: "🌬️" };
  if (lower.includes("thunderstorm"))
    return { choice: "STORMY & DRAMATIC", icon: "⚡" };

  return { choice: "CLEAR & CALM", icon: "☀️" }; // fallback
}

export default function WeatherScreen() {
  const navigate = useNavigate();
  const { setWeather } = useAppContext();

  const [localWeather, setLocalWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(true);
  const [confirmWeather, setConfirmWeather] = useState(false);

  const handleChoice = (choice) => {
    setWeather(choice);
    navigate("/loading");
  };

  const requestPermission = () => {
  setShowPermissionModal(false);
  setLoading(true);

  if (!navigator.geolocation) {
    console.warn("Geolocation not supported, falling back to IP");
    fallbackToIP();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const data = await fetchWeather(latitude, longitude);
        if (data) {
          setLocalWeather(data);
          setConfirmWeather(true);
        }
      } catch (err) {
        console.error("Weather API error:", err);
        fallbackToIP();
      }
      setLoading(false);
    },
    (error) => {
      console.warn("Geolocation error:", error);
      fallbackToIP();
      setLoading(false);
    }
  );
};

// 🌍 Fallback: use IP-based geolocation
const fallbackToIP = async () => {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    console.log("Fallback IP location:", data);

    const weather = await fetchWeather(data.latitude, data.longitude);
    if (weather) {
      setLocalWeather(weather);
      setConfirmWeather(true);
    }
  } catch (err) {
    console.error("IP Geolocation failed:", err);
  }
};



  return (
    <div className="weather-container">
      <h2 className="weather-title">What’s the weather like today?</h2>

      {/* 🌟 Step 1: Ask permission */}
      {showPermissionModal && (
        <div className="permission-overlay">
          <div className="permission-box">
            <h3>🍁 Allow Location</h3>
            <p>
              We’ll fetch your local weather to suggest the{" "}
              <b>perfect fall vibe</b> 🍂
            </p>
            <button className="choice-btn" onClick={requestPermission}>
              Detect My Weather
            </button>
            <button
              className="choice-btn ghost"
              onClick={() => setShowPermissionModal(false)}
              style={{ marginTop: "0.6rem" }}
            >
              No thanks, I’ll choose
            </button>
          </div>
        </div>
      )}

      {/* 🌟 Step 2: Confirm detected weather */}
      {confirmWeather && localWeather && (
        <div className="confirm-modal">
          <div className="confirm-box">
            <h3>📍 {localWeather.city}</h3>
            <p className="weather-info">
  <span className="emoji">{localWeather.emoji}</span>
  <span className="description">{localWeather.description}</span>
  ({localWeather.temp}°C)
</p>

            <p>
              Suggested vibe: <b>{localWeather.vibe}</b>
            </p>
            <div className="confirm-actions">
              <button
                className="choice-btn"
                onClick={() => handleChoice(localWeather.vibe)}
              >
                ✅ Use This Vibe
              </button>
              <button
                className="choice-btn ghost"
                onClick={() => setConfirmWeather(false)}
              >
                ❌ I’ll choose myself
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Always allow manual choices */}
      <div className="button-grid">
        <button
          className="choice-btn"
          onClick={() => handleChoice("CLEAR & CALM")}
        >
           CLEAR & CALM
        </button>
        <button
          className="choice-btn"
          onClick={() => handleChoice("RAINY & COZY")}
        >
           RAINY & COZY
        </button>
        <button
          className="choice-btn"
          onClick={() => handleChoice("WINDY & BROODING")}
        >
           WINDY & BROODING
        </button>
        <button
          className="choice-btn"
          onClick={() => handleChoice("STORMY & DRAMATIC")}
        >
           STORMY & DRAMATIC
        </button>
      </div>

      <NavButtons backPath="/with-who" />
    </div>
  );
}
