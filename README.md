# 🟢 DevDebug OS - Desktop Simulation

**DevDebug OS** is a premium, web-based operating system simulation designed with a high-end "Hacker Aesthetic." It features a neon-green visual language, transparent glassmorphic UI elements, and a fully functional multi-window desktop environment.

![Hacker Aesthetic](https://img.shields.io/badge/Aesthetic-Neon_Cyberpunk-00FF41?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-JS_HTML_CSS_Vite-00FF41?style=for-the-badge)

---

## 🚀 Key Features

### 🖥️ Desktop Experience
- **Multi-Window System**: Draggable, resizable, and minimizable windows with smooth animations.
- **Dynamic Taskbar**: Real-time system monitoring, volume control, date-time display, and active window tray.
- **Boot Sequence**: A cinematic terminal-style boot sequence with ASCII art and system initialization logs.
- **Secure Auth**: A themed authentication screen to grant access to the main desktop.

### 🎨 Featured Applications
- **Pixelr (Pixel Art Studio)**: A robust creative tool with:
  - 🖌️ Pencil & Eraser tools.
  - 🪣 Stack-based Flood Fill.
  - ↩️ Undo/Redo history (up to 50 states).
  - 💾 High-quality PNG export.
  - 🎨 Custom color picker and palette management.
- **Game Hub**: Includes classically themed games like **Snake**, **Pong**, and **TicTacToe**.
- **Mr. Robot**: An integrated AI-themed chatbot for interactive assistance.
- **Map View**: Fully functional global map integrated using Leaflet.js with coordinate and address search.
- **Encryptr**: A security utility for encoding and decoding messages.

### ⚙️ System Utilities
- **Terminal**: A functional command-line interface for system exploration.
- **Process Manager**: Real-time view of running "processes" and system load.
- **File Explorer**: Browse and manage simulated system files.
- **Settings**: Customize themes, sound effects, and volume levels.
- **Notepad**: Simple text editor for quick notes.

---

## 🛠️ Technology Stack

- **Core**: Vanilla JavaScript (ES6+ Modules)
- **Styling**: Tailwind CSS & Custom Vanilla CSS (Glassmorphism & Neon Glow)
- **Tooling**: Vite (Build System)
- **Icons**: Lucide Icons
- **Mapping**: Leaflet.js
- **Audio**: Web Audio API for interactive SFX and background music.

---

## 🏗️ Project Structure

```text
/
├── assets/             # Images, Sound FX, and Music
├── src/
│   ├── apps/           # Main applications (Pixelr, Map, Games, etc.)
│   ├── SystemUtil/     # System tools (Terminal, Files, Settings)
│   ├── main.js         # Core OS logic and window manager
│   ├── style.css       # Global design system and theme variables
│   └── profile.js      # User profile and UI state logic
├── index.html          # Entry point and resource loading
└── package.json        # Project dependencies and scripts
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn

### 2. Installation
```bash
git clone <repository-url>
cd devdebug-os
npm install
```

### 3. Development
Run the development server:
```bash
npm run dev
```

### 4. Build
Create a production bundle:
```bash
npm run build
```

---

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

---


