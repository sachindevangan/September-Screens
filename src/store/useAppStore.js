import { create } from "zustand";

export const useAppStore = create((set) => ({
  who: null,
  weather: null,
  setWho: (who) => set({ who }),
  setWeather: (weather) => set({ weather }),
}));
