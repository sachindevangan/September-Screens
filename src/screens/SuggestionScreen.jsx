import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { fetchMovieFromTMDB } from "../utils/tmdb";
import movies from "../data/movies.json";
import "./SuggestionScreen.css";

export default function SuggestionScreen() {
  const navigate = useNavigate();
  const {
    weather,
    withWho,
    selectedMovie,
    setSelectedMovie,
    suggestionPool,
    suggestionIndex,
    setSuggestionIndex,
    setSuggestionPool,
    addToWatchlist,
    watchlist,
  } = useAppContext();

  const [showTrailer, setShowTrailer] = useState(false);
  const [justAdded, setJustAdded] = useState(false); // ✅ new

  // normalize and filter pool
  useEffect(() => {
    if (!suggestionPool.length) {
      const normalized = movies.map((m) => ({
        title: m.movie,
        weather: m.weather,
        withWho: m.withWho,
      }));

      let filtered = normalized.filter(
        (m) => m.weather === weather && m.withWho === withWho
      );

      if (!filtered.length) filtered = normalized.filter((m) => m.weather === weather);
      if (!filtered.length) filtered = normalized.filter((m) => m.withWho === withWho);
      if (!filtered.length) filtered = normalized;

      setSuggestionPool(filtered);
      setSuggestionIndex(0);
    }
  }, [weather, withWho, suggestionPool, setSuggestionPool, setSuggestionIndex]);

  // reset justAdded whenever selectedMovie changes
  useEffect(() => {
    setJustAdded(false);
  }, [selectedMovie]);

  // Next suggestion
  // Next suggestion
const nextSuggestion = useCallback(async () => {
  if (!suggestionPool.length) return;

  // if at the last index, stop (or reset if you want)
  if (suggestionIndex >= suggestionPool.length - 1) {
    alert("No more suggestions in this category!");
    return; // 👈 stops instead of looping
  }

  const nextIndex = suggestionIndex + 1;
  setSuggestionIndex(nextIndex);

  const nextTitle = suggestionPool[nextIndex].title;
  const tmdb = await fetchMovieFromTMDB(nextTitle);
  setSelectedMovie(
    tmdb || { title: nextTitle, poster: null, overview: "" }
  );
}, [suggestionPool, suggestionIndex, setSuggestionIndex, setSelectedMovie]);


  if (!selectedMovie) {
    return (
      <div className="suggestion-container">
        <p>No suggestion yet.</p>
        <button className="btn" onClick={() => navigate("/tree")}>
          Back to Tree
        </button>
      </div>
    );
  }

  // check if already exists in watchlist
  const inWatchlist = watchlist.some((m) => m.title === selectedMovie.title);

  // handle add
  const handleAddToWatchlist = () => {
    addToWatchlist(selectedMovie);
    setJustAdded(true); // ✅ mark as just added
  };

  return (
    <div
      className="suggestion-container"
      style={{
        backgroundImage: selectedMovie.backdrop
          ? `url(${selectedMovie.backdrop})`
          : "url('/assets/backgrounds/SunnyLoading.gif')",
      }}
    >
      <div className="card">
        <h1 className="headline">Your movie suggestions are:</h1>

        <div className="content">
          {/* Poster */}
          <div className="poster-wrap">
            {selectedMovie.poster ? (
              <img
                src={selectedMovie.poster}
                alt={selectedMovie.title}
                className="poster"
              />
            ) : (
              <div className="poster placeholder">No Poster</div>
            )}
          </div>

          {/* Info */}
          <div className="info">
            <h2 className="title">
              {selectedMovie.title}{" "}
              {selectedMovie.releaseDate && (
                <span className="year">
                  ({new Date(selectedMovie.releaseDate).getFullYear()})
                </span>
              )}
            </h2>

            {selectedMovie.tagline && <p className="tagline">“{selectedMovie.tagline}”</p>}

            <p className="meta">
              {selectedMovie.runtime ? `${selectedMovie.runtime} min` : null}
              {selectedMovie.runtime && selectedMovie.genres?.length ? " • " : null}
              {selectedMovie.genres?.length ? selectedMovie.genres.join(", ") : null}
            </p>

            {typeof selectedMovie.rating === "number" && (
              <p className="rating">
                ⭐ {selectedMovie.rating.toFixed(1)} / 10{" "}
                ({selectedMovie.voteCount ? selectedMovie.voteCount.toLocaleString() : "—"} votes)
              </p>
            )}

            {selectedMovie.overview && <p className="overview">{selectedMovie.overview}</p>}

            {selectedMovie.director && <p className="crew">🎬 Directed by {selectedMovie.director}</p>}

            {Array.isArray(selectedMovie.cast) && selectedMovie.cast.length > 0 && (
              <p className="cast">👥 Starring: {selectedMovie.cast.join(", ")}</p>
            )}

            <div className="actions">
              <button className="btn" onClick={nextSuggestion}>
                Another Suggestion?
              </button>
              {selectedMovie.trailer && (
                <button className="btn trailer" onClick={() => setShowTrailer(true)}>
                  🎥 Watch Trailer
                </button>
              )}

              {/* ✅ Watchlist button logic */}
              {inWatchlist ? (
                justAdded ? (
                  <button className="btn watchlist-btn added" disabled>
                    ✔ Added to Watchlist
                  </button>
                ) : (
                  <button className="btn watchlist-btn already" disabled>
                    ✔ Already in Watchlist
                  </button>
                )
              ) : (
                <button className="btn watchlist-btn" onClick={handleAddToWatchlist}>
                  ➕ Add to Watchlist
                </button>
              )}

              <button className="btn ghost" onClick={() => navigate("/tree")}>
                Back to Tree
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div className="trailer-overlay" onClick={() => setShowTrailer(false)}>
          <div className="trailer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="trailer-header">
              <h3>September Screens 🍂</h3>
              <button className="close-btn" onClick={() => setShowTrailer(false)}>
                ✖
              </button>
            </div>
            <div className="trailer-body">
              <iframe
                src={selectedMovie.trailer}
                title="Movie Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
