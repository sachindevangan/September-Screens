// src/components/Loader.jsx
import React from "react";
import "./Loader.css";

export default function Loader({ weather }) {
  // pick emoji based on weather
  const weatherIcons = {
    "CRISP & SUNNY": "🌞",
    "RAINY & COZY": "🌧️",
    "WINDY & BROODING": "🌬️",
    "STORMY & DRAMATIC": "⚡",
  };

  const icon = weatherIcons[weather] || "🍿"; // fallback to popcorn

  return (
    <div className="loader-overlay">
      <div className="loader">{icon}</div>
      <p className="loader-text">Fetching your movie...</p>
    </div>
  );
}
