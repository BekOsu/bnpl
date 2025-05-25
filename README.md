# BNPL Platform – Full Stack App

A complete **Buy Now Pay Later (BNPL)** web application built with a modern stack:

- 🧠 **Backend**: Django REST Framework, Celery, PostgreSQL, Redis
- 💻 **Frontend**: React (Vite + TypeScript), TailwindCSS, DaisyUI
- 🐳 **Dockerized**: Ready for local or production deployment

---

## 🚀 Features

### 🔐 Authentication & Roles

- JWT-based login & refresh (`/api/token/`)
- User roles: `merchant`, `customer`
- Secure protected routes via access tokens

### 👩‍💼 Merchant Dashboard

- Create new BNPL plans
- View all plans created with installment tracking
- Merchant analytics: revenue, overdue count, success rate

### 🧾 Customer Dashboard

- View assigned BNPL plans
- Pay pending installments
- Past vs upcoming installments (color-coded)

### ⏱ Background Jobs

- Celery + Redis integration for scheduled tasks (e.g., due reminders)

---

## 🛠 Tech Stack

| Layer      | Stack                               |
|------------|--------------------------------------|
| Frontend   | React, Vite, TypeScript, DaisyUI     |
| Backend    | Django, Django REST Framework        |
| Auth       | JWT (access + refresh tokens)        |
| DB         | PostgreSQL                           |
| Async      | Celery + Redis                       |
| DevOps     | Docker + Docker Compose              |

## 🐳 Docker (Full Stack)

# From project root (aajil_project/)
```bash
docker-compose up --build
```

# This launches:
Django API on :8000

React frontend served via Nginx on :3000

PostgreSQL, Redis, Celery worker, Celery beat

⚠️ Make sure .env.prod is configured before Docker build.

