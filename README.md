# 🎬 September-Screens  

**September-Screens** is an interactive **Desktop GUI App** built with **React + Vite** and wrapped using **Electron**.  
It blends seasonal vibes, weather moods, and social settings to recommend the perfect movie.  
The app also includes immersive ambient sounds, a personalized watchlist, and a clean, fun interface.  

---

## ✨ Features  

- 🍂 **Vibe-based Movie Suggestions**  
  Choose your current mood:  
  - Weather → ☀️ Crisp & Sunny, 🌧️ Rainy & Cozy, 🌬️ Windy & Brooding, ⚡ Stormy & Dramatic  
  - Company → 👤 Alone, 👥 Friends, 👨‍👩‍👧 Family, ❤️ Special Someone  
  The app recommends movies that match these exact vibes.  

- 🎵 **Immersive Background Sounds**  
  Each weather choice comes with a custom ambient sound (birds, rain, wind, thunder) that fades smoothly.  

- 📝 **Watchlist with Persistence**  
  Save your favorite suggestions into a local **watchlist** stored in `localStorage`.  
  - Add or remove movies  
  - Auto-prevents duplicates  
  - Clear watchlist option  

- 💻 **Desktop Ready**  
  Fully wrapped in **Electron** → works as a **standalone desktop app** without relying on the browser.  

---

## 📂 Project Structure  

src/
├─ components/           # Reusable UI parts (SoundToggle, NavButtons, BackgroundSound, etc.)
├─ context/              # Global state with AppContext
├─ pages/                # Screens: Landing, WithWho, Weather, Tree, Suggestion, Watchlist
├─ assets/               # Background GIFs, icons, ambient sounds
└─ data/
   └─ movies.json        # Curated dataset with vibe tags

App.jsx                  # Main React app wrapper
index.jsx                # React entry point
electron.js              # Electron main process (desktop wrapper)
vite.config.js           # Vite configuration
package.json             # Scripts & dependencies


---

## 🚀 Getting Started  

### 1. Clone the Repository  
```bash
git clone https://github.com/your-username/September-Screens.git
cd September-Screens
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Run in Development (Browser Preview)

```bash
npm run dev
```

### 4. Run as Desktop App (Electron)
```bash
npm run electron:dev
```

### 4. Build for Production
```bash
npm run build
```

## 📖 Usage Flow

- Launch the app

- Select your weather mood + who you’re with

- Get a curated movie suggestion

- Add it to your watchlist if you like it

- Reopen anytime → your watchlist is saved locally

- Enjoy ambient vibes with movies ✨

## 🎨 Screenshots

(Add screenshots / GIFs here to show UI in action)

## 🛠️ Tech Stack

- React + Vite → UI & frontend logic

- Electron → Wraps app into a desktop-ready executable

- LocalStorage → Persistent watchlist

- CSS Animations → Styling & effects

- HTML5 Audio → Background ambience