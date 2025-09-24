// src/screens/WatchlistScreen.jsx
import React from "react";
import { useAppContext } from "../context/AppContext";
import "./WatchlistScreen.css";
import NavButtons from "../components/NavButtons";

export default function WatchlistScreen() {
  const { watchlist, removeFromWatchlist, clearWatchlist } = useAppContext();

  return (
    <div className="watchlist-container">
      <h1 className="watchlist-title">🎬 My Watchlist</h1>

      {watchlist.length === 0 ? (
        <p className="empty-msg">Your watchlist is empty. Add some movies!</p>
      ) : (  <>{/* Clear All Button */}
          <button className="clear-btn" onClick={clearWatchlist}>
            🗑️ Clear Watchlist
          </button>
        <div className="watchlist-grid">
        {watchlist.map((movie, index) => (
  <div
    key={movie.id || movie.title || index}
    className="watchlist-card"
  >
    {/* Poster */}
    {movie.poster ? (
      <img
        src={movie.poster}
        alt={movie.title}
        className="watchlist-poster"
      />
    ) : (
      <div className="watchlist-poster placeholder">No Poster</div>
    )}

    {/* Title */}
    <h3>{movie.title}</h3>

    {/* Genres */}
    {movie.genres?.length > 0 && (
      <p className="watchlist-genres">{movie.genres.join(", ")}</p>
    )}

    {/* Vibes (Weather + WithWho) */}
    <div className="watchlist-vibes">
      {movie.weather && (
        <span
          key={`${movie.id || movie.title}-weather`}
          className="watchlist-vibe"
        >
          🌤️ {movie.weather}
        </span>
      )}
      {movie.withWho && (
        <span
          key={`${movie.id || movie.title}-withWho`}
          className="watchlist-vibe"
        >
          👥 {movie.withWho}
        </span>
      )}
    </div>

    {/* Remove Button */}
    <button
      className="remove-btn"
      onClick={() => removeFromWatchlist(movie)}
    >
      ❌ Remove
    </button>
  </div>
))}
        </div>
        </>
      )}
      
      <NavButtons backPath="/" />
    </div>
  );
}
