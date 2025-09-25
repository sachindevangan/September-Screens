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
  const [leafMovies, setLeafMovies] = useState([]);

  // ✅ Backgrounds per weather
  const backgrounds = {
    "CRISP & SUNNY": `${import.meta.env.BASE_URL}assets/backgrounds/SunnyLoading.gif`,
    "RAINY & COZY": `${import.meta.env.BASE_URL}assets/backgrounds/RainyLoading.gif`,
    "WINDY & BROODING": `${import.meta.env.BASE_URL}assets/backgrounds/WindyLoading.gif`,
    "STORMY & DRAMATIC": `${import.meta.env.BASE_URL}assets/backgrounds/StormyLoading.gif`,
  };

  const bgImage =
    backgrounds[weather] ||
    `${import.meta.env.BASE_URL}assets/backgrounds/SunnyLoading.gif`;

  // Load & filter movies.json
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}data/movies.json`);
        const all = await res.json();

        const normalized = all.map((m) => ({
          title: m.movie,
          weather: m.weather,
          withWho: m.withWho,
        }));

        let filtered = normalized.filter(
          (m) => m.weather === weather && m.withWho === withWho
        );

        if (!filtered.length) {
          filtered = normalized.filter((m) => m.weather === weather);
        }

        if (!filtered.length) {
          filtered = normalized.filter((m) => m.withWho === withWho);
        }

        const pool = filtered.length ? filtered : normalized;

        setSuggestionPool(pool);
        setSuggestionIndex(0);

        const picks = [...pool]
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((x) => x.title);

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

  const handleLeafClick = async (movieName) => {
    if (!movieName) return;

    const tmdb = await fetchMovieFromTMDB(movieName);
    setSelectedMovie(
      tmdb || { title: movieName, poster: null, overview: "" }
    );
    navigate("/suggestion");
  };

  return (
    <div
      className="tree-container"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* ✅ Fixed Tree image path */}
      <img
        src={`${import.meta.env.BASE_URL}assets/backgrounds/SunnyTree.png`}
        alt="Tree"
        className={`tree ${shake ? "shake" : ""}`}
      />

      {showLeaves &&
        leafMovies.map((m, i) => (
          <button
            key={`${m}-${i}-${showLeaves}`} // ✅ force re-render to restart animation
            className={`leaf leaf-${i + 1}`}
            onClick={() => handleLeafClick(m)}
            aria-label={`Movie suggestion ${m}`}
          >
            🍂
          </button>
        ))}

      {showLeaves && (
        <p className="tree-note">
          Pick up a leaf to see your movie suggestion 🍂
        </p>
      )}

      <button className="shake-btn" onClick={handleShake}>
        SHAKE ME!
      </button>
      <NavButtons backPath="/weather" />
    </div>
  );
}
