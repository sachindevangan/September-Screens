// src/App.jsx
import React, { useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useAppContext } from "./context/AppContext";
import LandingPage from "./screens/LandingPage";
import WithWho from "./screens/WithWhoScreen";
import Weather from "./screens/WeatherScreen";
import TreeScreen from "./screens/TreeScreen";
import SuggestionScreen from "./screens/SuggestionScreen";
import WatchlistScreen from "./screens/WatchlistScreen"; // ✅ import
import BackgroundSound from "./components/BackgroundSound";
import SoundToggle from "./components/SoundToggle";
import Loading from "./screens/LoadingScreen";

function GlobalSound() {
  const { weather } = useAppContext();
  const location = useLocation();
  const audioRef = useRef();

  let soundKey = weather;

  // Force birds (icon + sound) on home and with-who
  if (location.pathname === "/" || location.pathname === "/with-who") {
    soundKey = "CRISP & SUNNY";
  }

  // Disable completely on watchlist
  if (location.pathname === "/watchlist") {
    soundKey = null;
  }

  return (
    <>
      <BackgroundSound weather={soundKey} audioRef={audioRef} />
      {soundKey && <SoundToggle audioRef={audioRef} weather={soundKey} />}
    </>
  );
}


export default function App() {
  return (
    <>
      <GlobalSound /> {/* 🎵 one global audio player */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/with-who" element={<WithWho />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/tree" element={<TreeScreen />} />
        <Route path="/suggestion" element={<SuggestionScreen />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/watchlist" element={<WatchlistScreen />} /> {/* ✅ */}
      </Routes>
    </>
  );
}
