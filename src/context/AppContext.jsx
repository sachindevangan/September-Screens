// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [withWho, setWithWho] = useState(null);
  const [weather, setWeather] = useState("CLEAR & CALM"); // 🌞 default
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [suggestionPool, setSuggestionPool] = useState([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  // ✅ Persistent watchlist
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("watchlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // ✅ Add movie with vibe tags
const addToWatchlist = (movie) => {
  if (!movie?.title) return;

  setWatchlist((prev) => {
    // Ensure unique id fallback if missing
    const safeId = movie.id || `${movie.title}-${Date.now()}`;

    // Skip only if EXACT same id already exists
    const exists = prev.some((m) => m.id === safeId);
    if (exists) return prev;

    return [...prev, { ...movie, id: safeId, weather, withWho }];
  });
};


  // ✅ Remove by id if present, else fallback to title
const removeFromWatchlist = (movie) => {
  setWatchlist((prev) => prev.filter((m) => m.id !== movie.id));
};

  // ✅ New clear method
  const clearWatchlist = () => {
    setWatchlist([]);
    localStorage.removeItem("watchlist");
  };

  return (
    <AppContext.Provider
      value={{
        withWho,
        setWithWho,
        weather,
        setWeather,
        selectedMovie,
        setSelectedMovie,
        suggestionPool,
        setSuggestionPool,
        suggestionIndex,
        setSuggestionIndex,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        clearWatchlist
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
