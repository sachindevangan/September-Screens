import React, { useState } from "react";

export default function SoundToggle({ audioRef, weather }) {
  const [muted, setMuted] = useState(false);

  // ✅ Shared cap
  const BACKGROUND_VOLUME = 0.25;

  // fade helper
  const fadeVolume = (audio, target, duration = 800) => {
    if (!audio) return;
    const stepTime = 50;
    const steps = duration / stepTime;
    const diff = target - audio.volume;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      currentStep++;
      audio.volume = Math.min(1, Math.max(0, audio.volume + diff / steps));

      if (currentStep >= steps) {
        clearInterval(fadeInterval);
        if (target === 0) {
          audio.muted = true;
        }
      }
    }, stepTime);
  };

  const toggleSound = () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (!muted) {
      fadeVolume(audio, 0, 800);
      setMuted(true);
    } else {
      audio.muted = false;
      audio.volume = 0;
      fadeVolume(audio, BACKGROUND_VOLUME, 800); // ✅ match BackgroundSound
      setMuted(false);
    }
  };

  const soundLabels = {
    "CRISP & SUNNY": "🌞 Birds",
    "RAINY & COZY": "🌧️ Rain",
    "WINDY & BROODING": "🌬️ Wind",
    "STORMY & DRAMATIC": "⚡ Thunder",
  };

  const currentLabel = soundLabels[weather] || "🔊 Sound";

  return (
    <button className="sound-btn" onClick={toggleSound}>
      {muted ? `🔇 ${currentLabel} Off` : `${currentLabel} On`}
    </button>
  );
}
