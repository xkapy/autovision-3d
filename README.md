# AutoVision 3D

A modern web application for generating 3D car models from photographs. Upload 4 photos of a vehicle (front, rear, left, right), generate a 3D model using AI, customize it with an interactive editor, and export for Blender or 3D printing.

## Features

- **4-Photo Upload** — Drag & drop interface with photo guides for each angle
- **AI 3D Generation** — Integration with Meshy AI for real image-to-3D conversion
- **Demo Mode** — Built-in procedural car model for instant preview without API keys
- **Interactive 3D Viewer** — Full orbit controls, zoom, auto-rotate with premium lighting
- **Customization Editor** — Paint color, metalness/roughness, license plates, accessories
- **Multi-Format Export** — GLB (Blender), STL (3D printing), OBJ (universal)
- **Screenshot Capture** — One-click PNG export from any camera angle
- **Day/Night Themes** — Glassmorphism UI with automotive-inspired design
- **Fully Responsive** — Works on desktop and mobile

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- Three.js + React Three Fiber + drei
- Zustand (state management)
- Framer Motion (animations)
- Meshy AI API (3D generation)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Using Meshy AI (Optional)

1. Create an account at [meshy.ai](https://meshy.ai)
2. Get your API key from the dashboard
3. In the app, select "Meshy AI" mode on the Generate page
4. Enter your API key (stored locally, never sent to any server except Meshy)

Without an API key, the app works in **Demo Mode** with a built-in procedural car model.

## Project Structure

```
src/
├── components/
│   ├── ui/          # Reusable UI components
│   ├── layout/      # Header, navigation
│   ├── upload/      # Photo upload + generation
│   ├── viewer/      # 3D model viewer (R3F)
│   ├── editor/      # Customization panel
│   └── export/      # Export dialog
├── stores/          # Zustand state management
├── services/        # API integrations
├── types/           # TypeScript definitions
├── utils/           # Export utilities
└── styles/          # Theme system + global CSS
```

## Export Formats

| Format | Use Case | Includes |
|--------|----------|----------|
| GLB | Blender, Unity, Unreal | Geometry + Textures + Materials |
| STL | 3D Printing (FDM/SLA) | Geometry only |
| OBJ | Legacy tools | Geometry only |

## License

MIT
