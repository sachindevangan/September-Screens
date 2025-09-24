import React, { useEffect, useRef } from "react";

export default function BackgroundSound({ weather, audioRef }) {
  const internalRef = useRef(null);
  const ref = audioRef || internalRef;

  // ✅ Shared cap for background audio
  const BACKGROUND_VOLUME = 0.25;

  const soundMap = {
    "CRISP & SUNNY": "/assets/sounds/sunny-birds.mp3",
    "RAINY & COZY": "/assets/sounds/rain.mp3",
    "WINDY & BROODING": "/assets/sounds/wind.mp3",
    "STORMY & DRAMATIC": "/assets/sounds/thunder.mp3",
  };

  const fadeDurations = {
    "CRISP & SUNNY": { fadeOut: 800, fadeIn: 1500 },
    "RAINY & COZY": { fadeOut: 1000, fadeIn: 2000 },
    "WINDY & BROODING": { fadeOut: 800, fadeIn: 1200 },
    "STORMY & DRAMATIC": { fadeOut: 400, fadeIn: 900 },
  };

  // 🔊 fade helper
  const fadeVolume = (audio, target, duration = 1000) => {
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
      }
    }, stepTime);
  };

  useEffect(() => {
    const audioEl = ref.current;
    if (!audioEl) return;

    // 🛑 Case 1: No weather → stop sound
    if (!weather) {
      fadeVolume(audioEl, 0, 600);
      setTimeout(() => {
        audioEl.pause();
        audioEl.src = "";
      }, 600);
      return;
    }

    // 🟢 Case 2: Valid weather → switch sound
    const { fadeOut, fadeIn } = fadeDurations[weather] || {
      fadeOut: 800,
      fadeIn: 1200,
    };

    if (!audioEl.paused && audioEl.src) {
      fadeVolume(audioEl, 0, fadeOut);
    }

    setTimeout(() => {
      audioEl.pause();
      audioEl.src = soundMap[weather];
      audioEl.load();

      audioEl.volume = 0;
      audioEl
        .play()
        .then(() => fadeVolume(audioEl, BACKGROUND_VOLUME, fadeIn))
        .catch((err) => console.warn("⚠️ Autoplay blocked:", err));
    }, fadeOut);
  }, [weather]);

  return <audio ref={ref} loop hidden />;
}
