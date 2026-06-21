# 🛡️ Cyber News AI

An AI-powered cybersecurity news digest that fetches the latest threats from top security sources, generates detailed explanations using AI, and narrates them as audio in **English, Tamil, Hindi, and Malayalam**.

> Stay informed about cybersecurity threats in the language you're most comfortable with — read it, or just listen.

---

## ✨ Features

- 📡 **Automated daily fetching** from 5 leading cybersecurity news sources via RSS
- 🤖 **AI-generated explanations** — not just headlines, but detailed breakdowns of what happened, how the attack works, who's affected, and recommended actions
- 🌐 **Multi-language support** — full text + audio narration in English, Tamil, Hindi, and Malayalam
- 🔊 **Text-to-speech audio** for every article in every supported language
- 🎯 **Smart severity tagging** (Critical / High / Info)
- 🔁 **Resilient AI pipeline** — automatic fallback between providers, retry logic, rate-limit handling
- 🌑 **Dark, terminal-inspired UI** built for security professionals

---

## 🏗️ Architecture
RSS Sources (5)  →  Fetch & Parse  →  Dedupe Check

│

▼

AI Explanation (Groq → Gemini fallback)

│

▼

Text-to-Speech (4 languages, parallel)

│

▼

MongoDB Storage

│

▼

REST API  →  React Frontend

A daily scheduled job fetches recent articles (last 48 hours), generates AI explanations in all 4 languages in a single pass, converts each to audio, and stores everything for the frontend to display.

---

## 🛠️ Tech Stack

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- `node-cron` for scheduling
- `rss-parser` for feed ingestion
- `edge-tts-universal` for text-to-speech
- Groq API (Llama 3.3 70B) — primary AI provider
- Google Gemini API — fallback AI provider

**Frontend**
- React + Vite
- React Router
- Axios

---

## 📁 Project Structure
cyber-news-ai/

├── backend/

│   ├── config/          # DB connection, RSS sources, language config

│   ├── controllers/      # Route handlers

│   ├── cron/             # Scheduled daily fetch job

│   ├── models/            # MongoDB schemas

│   ├── routes/             # API routes

│   ├── services/            # RSS, AI, TTS, pipeline orchestration

│   ├── utils/                 # Logger

│   └── server.js

└── frontend/

└── src/

├── components/    # Reusable UI components

├── pages/          # Route-level pages

├── services/        # API client

└── utils/             # Helpers (severity, time formatting)

---

## 📰 News Sources

| Source | 
|---|
| The Hacker News |
| BleepingComputer |
| Krebs on Security |
| Dark Reading |
| SecurityWeek |

> This project never reproduces full articles. It generates original AI explanations from headlines and short summaries, and always links back to the original source.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Groq API key ([console.groq.com](https://console.groq.com))
- Gemini API key ([aistudio.google.com/apikey](https://aistudio.google.com/apikey))

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
PORT=5000

MONGODB_URI=your_mongodb_atlas_uri

GROQ_API_KEY=your_groq_key

GEMINI_API_KEY=your_gemini_key

REFRESH_SECRET=your_own_secret_string

NODE_ENV=development

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/news` | Paginated list of processed news |
| `GET` | `/api/news/:id` | Full detail of one news item (all languages) |
| `POST` | `/api/news/refresh` | Manually trigger the fetch pipeline (requires `x-refresh-secret` header) |

---

## ⏰ Scheduling

The pipeline runs automatically every day. In production, it's triggered via an external scheduler (e.g. [cron-job.org](https://cron-job.org)) hitting the `/api/news/refresh` endpoint, since serverless free-tier hosting doesn't guarantee uptime for in-process cron jobs.

---

## 🔒 Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `GROQ_API_KEY` | Groq API key (primary AI provider) |
| `GEMINI_API_KEY` | Google Gemini API key (fallback AI provider) |
| `REFRESH_SECRET` | Custom secret to protect the manual refresh endpoint |
| `PORT` | Server port (auto-assigned on most hosts) |

---

## 📄 License

This is a personal project built for learning and personal use. Cybersecurity news content is AI-summarized from public RSS feeds with links back to original sources — no original article content is reproduced.

---