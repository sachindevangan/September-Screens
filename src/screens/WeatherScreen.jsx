import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext"
import "./WeatherScreen.css";
import NavButtons from "../components/NavButtons";

export default function Weather() {
  const navigate = useNavigate();
  const { setWeather } = useAppContext();

  const handleChoice = (choice) => {
  setWeather(choice);
  navigate("/loading");  // go to loading screen first
};


  return (
    <div className="weather-container">
      <h2 className="weather-title">What’s the weather like today?</h2>
      <div className="button-grid">
        <button className="choice-btn" onClick={() => handleChoice("CRISP & SUNNY")}>
          CRISP & SUNNY
        </button>
        <button className="choice-btn" onClick={() => handleChoice("RAINY & COZY")}>
          RAINY & COZY
        </button>
        <button className="choice-btn" onClick={() => handleChoice("WINDY & BROODING")}>
          WINDY & BROODING
        </button>
        <button className="choice-btn" onClick={() => handleChoice("STORMY & DRAMATIC")}>
          STORMY & DRAMATIC
        </button>
      </div>
     <NavButtons backPath="/with-who" />
    </div>
  );
}
