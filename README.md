# SentinelX — Insider Threat Detection Dashboard

> Behavioral anomaly detection system for identifying insider threats in enterprise environments, built for **InnovaHack Chapter 1**.

## Live Demo

- **Frontend**: [https://sentinelx-theta.vercel.app](https://sentinelx-theta.vercel.app)
- **Backend**: [https://sentinelx-api.onrender.com](https://sentinelx-api.onrender.com)

---

## Architecture

```
┌──────────────┐     REST / WebSocket     ┌────────────────┐
│  React SPA   │ ◄──────────────────────► │  Express.js    │
│  (Vite)      │                          │  (SQLite DB)   │
└──────────────┘                          └────────────────┘
```

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + better-sqlite3 + WebSocket (ws)
- **State**: Zustand (global) + React hooks (local)
- **Animations**: Framer Motion
- **Charts**: Recharts + custom SVG radar

---

## Features

### Core Detection
- **Z-score anomaly detection** — each user's event counts are compared against their personal rolling baseline (mean + 1.5σ threshold)
- **Behavioral fingerprinting** — per-user radar charts showing normal activity patterns
- **Confidence scoring** — multi-factor risk assessment (time, file sensitivity, transfer volume, access patterns)
- **Auto-calibration** — sensitivity slider adjusts detection threshold in real-time

### Dashboard
- **Alert feed** with severity badges, filters, and search
- **Alert detail** with event breakdown, explainability panel, and radar fingerprint
- **False positive control center** — mark alerts as FP/TP with confirmation dialogs; feedback loop recalibrates baselines
- **Action log** — full audit trail of every action taken
- **Overview** — org-wide stats, charts, risk heatmap, user activity bar chart

### UI/UX
- Dark navy theme with glassmorphism cards
- Animated landing page with typewriter hero, scroll reveals, floating orbs, mesh gradient background
- Mobile bottom navigation bar
- Skeleton loading states
- Error boundary with recovery UI
- Toast notifications for actions
- CSV export for alerts
- Print-friendly styles

### Backend
- SQLite database with auto-seeding (200 users, login/file/transfer events, baselines, alerts)
- REST API (`/api/alerts`, `/api/users`, `/api/baselines`, `/api/action-log`)
- WebSocket server for real-time alert updates
- Feedback endpoint for false positive / true positive marking
- Sensitivity endpoint for threshold adjustment

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Development

```bash
npm install
npm run dev          # Starts both backend (3001) and frontend (5173)
```

### Production

```bash
npm run build        # TypeScript check + Vite build
npm run start        # Serves everything from single Express server
```

---

## Project Structure

```
sentinelx/
├── server/
│   └── index.js          # Express backend + SQLite + WebSocket
├── src/
│   ├── api/client.ts     # API client + WebSocket connection
│   ├── components/       # UI components
│   │   ├── AlertCard.tsx
│   │   ├── AlertDetail.tsx
│   │   ├── BottomNav.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── RadarFingerprint.tsx
│   │   ├── SensitivitySlider.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Skeleton.tsx
│   │   └── StatCard.tsx
│   ├── data/seed.ts      # Data generation + baseline computation
│   ├── hooks/useSentinelX.ts
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── Overview.tsx
│   │   ├── Alerts.tsx
│   │   ├── AlertDetail.tsx
│   │   ├── ExplainPage.tsx
│   │   ├── FalsePositives.tsx
│   │   └── ActionLog.tsx
│   ├── store/useStore.ts # Zustand global state
│   ├── types/index.ts
│   ├── utils/helpers.ts
│   ├── utils/export.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── vite.config.ts
└── package.json
```

---

## Team

| Name | Role |
|------|------|
| **Thanuj Mori** | Full-Stack Development |
| **Likith Tholapu** | Full-Stack Development |

---

## License

MIT
