// src/screens/LandingPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>SEPTEMBER SCREENS!</h1>
        <p>
          Welcome to your September movie cinema! Tell us about your weather and
          we’ll suggest you some great movies to binge alone or with your special
          someone.
        </p>
        <p className="tagline">SEPTEMBER & CHILL</p>
        <div className="landing-buttons">
          <button onClick={() => navigate("/with-who")}>TRY IT OUT</button>
        </div>
      </div>
    </div>
  );
}
