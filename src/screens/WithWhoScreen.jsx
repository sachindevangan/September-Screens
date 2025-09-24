import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import "./WithWho.css";
import NavButtons from "../components/NavButtons";

export default function WithWho() {
  const navigate = useNavigate();
  const { setWithWho } = useAppContext();

  const handleChoice = (choice) => {
    setWithWho(choice);
    navigate("/weather");
  };

  return (
    <div className="withwho-container">
      <h2 className="withwho-title">Who are you planning to watch a movie with?</h2>

      <div className="button-grid">
        <button className="choice-btn" onClick={() => handleChoice("ALONE")}>ALONE</button>
        <button className="choice-btn" onClick={() => handleChoice("FAMILY")}>FAMILY</button>
        <button className="choice-btn" onClick={() => handleChoice("FRIENDS")}>FRIENDS</button>
        <button className="choice-btn" onClick={() => handleChoice("SPECIAL SOMEONE")}>SPECIAL SOMEONE</button>
      </div>
      <NavButtons backPath="/" />
    </div>
  );
}
