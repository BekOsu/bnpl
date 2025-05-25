# BNPL Frontend

This is the frontend of the **Buy Now Pay Later** (BNPL) platform, built using **React + TypeScript + Vite + TailwindCSS**. It supports merchant and customer dashboards, authentication with JWT, and plan/payment flows.

---

## 🖥️ Tech Stack

- **React 19 + Vite** – fast frontend tooling
- **TypeScript** – strict typing
- **Tailwind CSS + DaisyUI** – UI framework
- **Axios** – API requests
- **React Router DOM** – routing
- **React Query** – data fetching & caching
- **React Toastify** – notifications
- **Docker + Nginx** – production deployment

---

## 🚀 Getting Started (Local Dev)

### 1. Install dependencies

```bash
npm install
``` 

## 2. Run development server
```bash
npm run dev
```
App will be available at: http://localhost:5173

⚠️ Requires backend to be running at http://localhost:8000/api/

## 📦 Project Structure
```bash
src/
  api/             ← Axios client with interceptors
  auth/            ← Login, Register, AuthContext
  components/      ← Navbar, ProgressBar, etc.
  merchant/        ← Merchant dashboard + create plan
  user/            ← User dashboard + pay installments
  main.tsx         ← Entry point
  App.tsx          ← Router + Route guards
public/
  index.html
tailwind.config.js
vite.config.ts
```

## 🔒 Authentication Workflow
JWT access + refresh tokens
Stored in localStorage
Auto-refresh via /token/refresh/
Protected routes via <PrivateRoute /> and <RoleRoute />

## 🐳 Docker Deployment
1. Build Docker image
```bash
docker build -t bnpl-frontend .
```
2. Run Docker container
```bash
docker run -p 3000:80 bnpl-frontend
```
Access: http://localhost:3000

## ⚙️ Nginx Config
```bash
nginx.conf (auto-included in Docker):

server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri /index.html;
  }
}
```

## 📜 License
MIT © 2025 Ajiil