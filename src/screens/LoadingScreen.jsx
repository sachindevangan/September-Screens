import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import "./LoadingScreen.css";

export default function LoadingScreen() {
  const navigate = useNavigate();
  const { weather } = useAppContext();
  const [progress, setProgress] = useState(0);

  // Backgrounds per weather
  const backgrounds = {
    "CRISP & SUNNY": "/assets/backgrounds/SunnyLoading.gif",
    "RAINY & COZY": "/assets/backgrounds/RainyLoading.gif",
    "WINDY & BROODING": "/assets/backgrounds/WindyLoading.gif",
    "STORMY & DRAMATIC": "/assets/backgrounds/StormyLoading.gif",
  };

  const bgImage =
    backgrounds[weather] || "/assets/backgrounds/SunnyLoading.gif";

 useEffect(() => {
  const duration = 5000; // total load time (ms)
  const steps = 10;      // number of chunky steps
  const interval = duration / steps;
  let currentStep = 0;

  const timer = setInterval(() => {
    currentStep++;
    setProgress((currentStep / steps) * 100);
    if (currentStep >= steps) {
      clearInterval(timer);
      navigate("/tree");
    }
  }, interval);

  return () => clearInterval(timer);
}, [navigate]);


  return (
    <div
      className="loading-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay tint */}
      <div className="loading-overlay"></div>

      <h2 className="loading-text">
        Let me change the weather for you... <br />
        and give you some movie suggestions. <br />
        Thank me later!
      </h2>

      {/* Fox GIF */}
      <img
        src="/assets/backgrounds/fox.gif"
        alt="Fox helper"
        className="loading-fox"
      />

      {/* Pixel loading bar */}
      <div className="loading-bar">
        <div
          className="loading-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
