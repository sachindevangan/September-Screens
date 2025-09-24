import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import "./NavButtons.css";

export default function NavButtons({ backPath }) {
  const navigate = useNavigate();
  const { watchlist } = useAppContext();

  return (
    <div className="nav-buttons">
      {backPath && (
        <button className="nav-btn" onClick={() => navigate(backPath)}>
           ⬅ Back
        </button>
      )}
      <button className="nav-btn" onClick={() => navigate("/")}>
        🏠 Home
      </button>
      {/* ✅ Show Watchlist only if user has items */}
      {watchlist.length > 0 && (
        <button className="nav-btn" onClick={() => navigate("/watchlist")}>
          📚 My Watchlist
        </button>
      )}
    </div>
  );
}
