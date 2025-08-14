# Real-Time Chat Application (Socket.IO + React + Vite)

## Overview
This project contains:
- `server/` — Node.js + Express + Socket.IO server (stores in-memory message history)
- `client/` — React app (Vite) using `socket.io-client` for real-time messaging

## Requirements
- Node.js v16+ (recommend v18+)
- npm

## Quick start (development)
1. Unzip the project and open two terminals or use a terminal multiplexer.
2. Server:
   ```
   cd server
   npm install
   npm run start
   ```
   Server runs on http://localhost:3000 by default.
3. Client:
   ```
   cd client
   npm install
   npm run dev
   ```
   Vite dev server runs on http://localhost:5173 by default.
4. Open the client URL in your browser. Open multiple tabs to test real-time chat.

## Production build (optional)
You can build the React app and serve static files from the server:
1. In `client/`:
   ```
   npm run build
   ```
   This outputs `dist/`.
2. Copy `dist/` into `server/public` (or configure server to serve `client/dist`), then start server.

## Notes
- Message history is stored in server memory. Restarting server clears history.
- Client shows messages immediately (optimistic render) and the server echoes back.
