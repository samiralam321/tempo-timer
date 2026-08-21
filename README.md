# ⏳ TEMPO — Aesthetic Lofi Pomodoro Timer

![Tempo Banner](https://tempo-timer-five.vercel.app/backgrounds/cozy.jpg)

<p align="center">
  <b>A minimal, distraction-free, aesthetic Lofi Pomodoro Timer designed for deep focus and study sessions.</b>
  <br />
  <a href="https://tempo-timer-five.vercel.app/"><strong>🌐 Live Demo »</strong></a>
  <br /><br />
  <a href="https://tempo-timer-five.vercel.app/">
    <img src="https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel Live Demo" />
  </a>
  <a href="https://github.com/samiralam321/tempo-timer">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repo" />
  </a>
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

---

## ✨ Features

- 🎯 **3 Focus Modes**: Pomodoro (25m), Short Break (5m), and Long Break (15m) with timestamp math accuracy (`Date.now()`).
- 🎬 **Dynamic High-Quality Backgrounds**: Supports 2K/4K HD wallpapers and seamless looping live video atmospheres.
- 🎵 **Audio-Only Lofi Player**: Integrated YouTube audio player queue (zero video boxes or thumbnails) with Next/Prev track controls.
- 🎨 **Distraction-Free Design**: Clean translucent dark glass aesthetic, no marketing clutter, no AI-slop gradients or emojis.
- ⚙️ **Custom Durations & Preferences**: Configurable timer durations saved automatically to `localStorage`.
- ⌨️ **Keyboard Shortcuts**: Control playback and timer status instantly using your keyboard.
- 🖥️ **Native Fullscreen Mode**: Single click fullscreen toggle (`⛶`) for an immersive study workspace.

---

## 🎧 Curated Music Queue

The bottom-left ultra-compact music capsule includes a curated audio queue:

1. **Lofi Girl Beats** (`Njt1io9jakQ`)
2. **Sparkle** (`-pHfPJGatgE`)
3. **Ghibli Music** (`CeItO4-ARfk`)
4. **Deep Focus Beats** (`MzgMBrtrFc4`)

---

## 🌆 Background Atmospheres & Live Videos

Includes high-resolution wallpapers and video loops selectable via the bottom-right gallery icon:

- 🌇 **Boy Studying at Desk** *(Default HD Image)*
- 🌲 **Japanese Rain Forest 2K**
- 🏔️ **Japanese Mountain Sunset**
- 🌌 **Swirling Sky & Tree 4K**
- 🌌 **Aesthetic Space**
- 🌊 **Calm Ocean Bench** *(Live Video)*
- 🍃 **Clouds & Leaves** *(Live Video)*
- 🌆 **Dusk City Skyline**
- 🌧️ **Cozy Rain Window**
- 🌅 **Golden Sunset**

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `Space` | Start / Pause Timer |
| `R` | Reset Current Mode Timer |

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Styling**: Modern Vanilla CSS (Glassmorphism, CSS Variables, Flexbox/Grid)
- **Audio Engine**: YouTube IFrame PostMessage API (Offscreen Hidden Audio)
- **Deployment**: [Vercel](https://vercel.com/) / [Netlify](https://www.netlify.com/)

---

## 🚀 Local Development Setup

To run Tempo locally on your machine:

```bash
# 1. Clone the repository
git clone https://github.com/samiralam321/tempo-timer.git

# 2. Navigate into the project folder
cd tempo-timer

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

Open your browser at `http://localhost:5173/` to view the app!

---

## 📦 Build for Production

```bash
# Create optimized production build in /dist
npm run build

# Preview production build locally
npm run preview
```

---

## 👤 Author

**Samir Alam**
- **GitHub**: [@samiralam321](https://github.com/samiralam321)
- **Live App**: [https://tempo-timer-five.vercel.app/](https://tempo-timer-five.vercel.app/)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
