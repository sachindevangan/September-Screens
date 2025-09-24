import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { fetchMovieFromTMDB } from "../utils/tmdb";
import "./TreeScreen.css";
import NavButtons from "../components/NavButtons";


export default function TreeScreen() {
  const navigate = useNavigate();
  const {
    weather,
    withWho,
    setSelectedMovie,
    setSuggestionPool,
    setSuggestionIndex,
  } = useAppContext();

  const [shake, setShake] = useState(false);
  const [showLeaves, setShowLeaves] = useState(false);
  const [leafMovies, setLeafMovies] = useState([]); // 3 titles for the leaves

  // Backgrounds per weather (GIFs)
  const backgrounds = {
    "CRISP & SUNNY": "/assets/backgrounds/SunnyLoading.gif",
    "RAINY & COZY": "/assets/backgrounds/RainyLoading.gif",
    "WINDY & BROODING": "/assets/backgrounds/WindyLoading.gif",
    "STORMY & DRAMATIC": "/assets/backgrounds/StormyLoading.gif",
  };
  const bgImage =
    backgrounds[weather] || "/assets/backgrounds/SunnyLoading.gif";

  // Load & filter movies.json -> choose 3 random titles for leaves
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/data/movies.json");
        const all = await res.json();

        // normalize: always have .title
        const normalized = all.map((m) => ({
          title: m.movie, // rename "movie" → "title"
          weather: m.weather,
          withWho: m.withWho,
        }));

        // --- filtering priority ---
        // 1. Exact match (weather + withWho)
        let filtered = normalized.filter(
          (m) => m.weather === weather && m.withWho === withWho
        );

        // 2. If no match → relax to weather only
        if (!filtered.length) {
          filtered = normalized.filter((m) => m.weather === weather);
        }

        // 3. If still no match → relax to withWho only
        if (!filtered.length) {
          filtered = normalized.filter((m) => m.withWho === withWho);
        }

        // 4. If still no match → fallback to all
        const pool = filtered.length ? filtered : normalized;

        // keep full pool for "Another suggestion" later
        setSuggestionPool(pool);
        setSuggestionIndex(0);

        // pick 3 random unique titles
        const picks = [...pool]
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((x) => x.title);

        console.log("🎬 Movie pool:", pool);
        console.log("🍂 Picks for leaves:", picks);

        setLeafMovies(picks);
      } catch (e) {
        console.error("💥 Error loading movies.json:", e);
      }
    }
    load();
  }, [weather, withWho, setSuggestionPool, setSuggestionIndex]);

  const handleShake = () => {
    setShake(true);
    setShowLeaves(false);
    setTimeout(() => {
      setShake(false);
      setShowLeaves(true);
    }, 900);
  };

  // when user clicks a leaf → resolve TMDB → go to /suggestion
  const handleLeafClick = async (movieName) => {
    console.log("🍂 Leaf clicked:", movieName);

    if (!movieName) return; // safety guard

    const tmdb = await fetchMovieFromTMDB(movieName);
    setSelectedMovie(
      tmdb || { title: movieName, poster: null, overview: "" }
    );
    navigate("/suggestion");
  };

  return (
  <div
    className="tree-container"
    style={{ backgroundImage: `url(${bgImage})` }}
  >
    <img
      src="/assets/backgrounds/SunnyTree.png"
      alt="Tree"
      className={`tree ${shake ? "shake" : ""}`}
    />
    {showLeaves && (
      <>
        {leafMovies.map((m, i) => (
          <button
            key={i}
            className={`leaf leaf-${i + 1}`}
            onClick={() => handleLeafClick(m)}
            aria-label={`Movie suggestion ${m}`} // accessibility only
          >
            🍂
          </button>
        ))}
      </>
    )}

        {/* ✨ Note message */}
    {showLeaves && (
      <p className="tree-note">Pick up a leaf to see your movie suggestion 🍂</p>
    )}


    <button className="shake-btn" onClick={handleShake}>
      SHAKE ME!
    </button>
    <NavButtons backPath="/weather" />
  </div>
);
}
