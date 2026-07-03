# Smart Campus Dashboard — Defense & User Control

###**User control and securit monitoring dashboard Smart Campus Simulation Project using Raspberry Pi**

A dual-dashboard IoT monitoring and security interface for a simulated smart campus, built with React + Vite. The system splits responsibilities into two independent views: a **Defense Dashboard** for cybersecurity/attack monitoring and a **User Dashboard** for physical sensor control across campus sectors.

---

## Overview

The app opens on a login/landing screen with two entry points:

| Dashboard | Purpose |
|---|---|
| **User Control Dashboard** | Monitor and toggle physical IoT sensors (motion, light, temperature, smoke, soil moisture, ultrasonic, IR, gate) across four campus sectors: Building A, Building B, Parking Area, and Park Zone. |
| **Defense & Security Dashboard** | Live network attack detection feed and Raspbian OS-level mitigation controls (firewall, Fail2Ban, rate limiting, ARP guard, port security), with real-time charts for system health and network traffic. |

The two dashboards are intentionally decoupled — the defense view never surfaces raw sensor data, and the user view never surfaces attack/security internals.

## Features

**User Dashboard**
- Sector filter (All / Building A / Building B / Parking / Park)
- Per-sensor live value, unit, last-update timestamp, and ON/OFF toggle
- Summary cards: active sensor count, online node count, network status, Pi temperature

**Defense Dashboard**
- Live attack detection feed (DoS, SQL Injection, Brute Force, ARP Spoofing, Port Scan, MITM) with severity badges and a one-click "Block IP" action
- Toggleable mitigation controls (UFW Firewall, Fail2Ban, Rate Limiting, ARP Guard, Port Security)
- Real-time charts (Recharts): attack timeline (area chart), attack distribution (pie chart), CPU/memory/temperature (line chart), network packet traffic (bar chart)
- Email alert toggle
- System health cards with warning thresholds

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 19 |
| Build tool / dev server | Vite 7 |
| Styling | Tailwind CSS 4 |
| Charts | Recharts 3 |
| Icons | Lucide React |
| Deployment target | Raspberry Pi 4 (Raspbian OS) |

## Current State — Simulation Mode

This version of the app is **self-contained on the frontend**: attack events, sensor readings, and system health metrics are generated client-side with `setInterval` + randomized values, purely to demonstrate the UI/UX and data flow. There is currently no live backend wired into this codebase (no WebSocket/MQTT client, no API calls).

For a production deployment against real hardware, the intended architecture is:
- **Backend:** Python Flask + Flask-SocketIO, hosted on the Pi (or another Linux host on the same network)
- **Sensor transport:** MQTT (Mosquitto broker) publishing from ESP32 nodes per sector
- **Frontend:** this React app, subscribing to socket events and replacing the simulated `setInterval` logic with real pushed updates

Wiring that up would mean replacing the mock data generators in `src/App.jsx` with a `socket.io-client` connection and mapping incoming events onto the existing `sectors` / `attackMetrics` / `systemHealth` state shapes.

## Project Structure

```
smart-campus/
├── src/
│   ├── App.jsx          → Login screen + User Dashboard + Defense Dashboard (single file, view-switched)
│   ├── App.css
│   ├── index.css         → Tailwind import
│   └── main.jsx           → React entry point
├── public/
├── vite.config.js         → Vite + Tailwind plugin config
├── package.json
└── smart_campus_dashboard.tsx   → (reference/scratch copy, not used by the build)
```

## Getting Started

```bash
cd smart-campus
npm install
npm run dev -- --host
```

The `--host` flag exposes the dev server on your machine's network IP so it can be reached from other devices (e.g. testing on a phone or another laptop on the same Wi-Fi).

Build for production:

```bash
npm run build
npm run preview
```

### Running on a Raspberry Pi (production)

See `smart-campus/README.md` for the full Raspberry Pi deployment walkthrough, including installing Node via `nvm`, transferring the project, and setting up a `systemd` service so the dashboard starts automatically on boot.

## Notes

- Sensor and sector data (IPs, ESP32 node names, sensor types) are currently hardcoded in `App.jsx` as placeholder/demo values.
- Color styling uses inline styles / a predefined `COLOR_STYLES` map rather than dynamically constructed Tailwind class names, to avoid classes being purged from the production build.

---
*Smart Campus Simulation Project — RNS Institute of Technology*
