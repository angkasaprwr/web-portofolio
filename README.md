# Sukma. — Personal Portfolio Website

Production-ready personal portfolio for **Rr Sukma Ayu Dwi Wulandari** (UI/UX Designer) with a public showcase site and an Admin CMS.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, Tailwind CSS 4, React Router, Framer Motion, GSAP, Lenis, TanStack Query, Axios, React Hook Form, Zod, Swiper |
| Backend | Node.js, Express, Clean Architecture (Controller → Service → Repository) |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT access token + HttpOnly refresh cookie, bcrypt |
| Storage | Local `uploads/` (Cloudinary-ready) |

## Project Structure

```
web-portofolio/
├── client/          # React frontend (Vercel)
├── server/          # Express API (Railway / Render)
├── prisma/          # Schema, migrations, seed
├── uploads/         # Local file storage
├── docs/            # Documentation
├── .env.example
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### 1. Clone & install

```bash
git clone https://github.com/angkasaprwr/web-portofolio.git
cd web-portofolio
cp .env.example .env
# Edit .env with your DATABASE_URL and secrets
npm run setup
```

Or step by step:

```bash
npm install
npm install --prefix client
npm install --prefix server
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 2. Run development

```bash
# Terminal 1 — API (port 5000)
npm run server

# Terminal 2 — Frontend (port 5173)
npm run client

# Or both
npm run dev
```

- Public site: http://localhost:5173
- Admin login: http://localhost:5173/admin/login
- API docs: http://localhost:5000/api/docs

### Default Admin

```
Email: admin@sukma.dev
Password: Admin@123456
```

Change these in production via `.env` before seeding.

## Public Pages

- **Beranda** — Hero, stats, about/project/skill previews, CTA
- **Tentang Saya** — Story, bio (no address/phone), education timeline, hobbies
- **Proyek** — Category cards → filter, search, pagination, detail
- **Keahlian** — Core skills, tools, progress bars
- **Pengalaman** — Formal/Informal categories, filter, detail
- **Kontak** — WhatsApp / Gmail / GitHub / LinkedIn cards only (no form, no phone/email text)

## Admin Dashboard

`/admin` — Overview charts, CRUD for About, Skills, Projects, Experiences, Certificates, CV, Social Links, Settings. JWT-protected.

## Environment Variables

See [`.env.example`](./.env.example).

Frontend (optional `client/.env`):

```
VITE_API_URL=http://localhost:5000/api/v1
VITE_ASSET_URL=http://localhost:5000
```

In development, Vite proxies `/api` and `/uploads` to the backend.

## Deployment

### Frontend — Vercel

1. Import repo, set root to `client`
2. Build: `npm run build` · Output: `dist`
3. Env: `VITE_API_URL=https://your-api.railway.app/api/v1`

See `client/vercel.json`.

### Backend — Railway / Render

1. Root: `server` (or monorepo with start script)
2. Build: `cd .. && npx prisma generate --schema=prisma/schema.prisma`
3. Start: `node src/server.js`
4. Attach Neon PostgreSQL `DATABASE_URL`
5. Set JWT secrets, `CLIENT_URL`, run `prisma migrate deploy` + seed once

See `docs/DEPLOYMENT.md`.

### Database — Neon PostgreSQL

Create a Neon project, copy the connection string into `DATABASE_URL` (include `?sslmode=require`).

## API Overview

Base: `/api/v1`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | — | Admin login |
| POST | `/auth/refresh` | Cookie | Refresh tokens |
| GET | `/about` | — | Public about |
| GET | `/projects` | — | List + filter/search/pagination |
| GET | `/skills` | — | Skills list |
| GET | `/experiences` | — | Experiences list |
| GET | `/social-links` | — | Contact platforms |
| GET | `/dashboard` | JWT | Admin overview |
| * | CRUD routes | JWT | Full admin mutations |

Full docs: http://localhost:5000/api/docs (Swagger).

## Design System

- Pink `#F857A6` · Soft Pink `#FFD6E8` · Light Pink `#FFF3F8` · Gold `#D4AF37`
- Headings: Playfair Display · Body: Poppins
- Glassmorphism navbar, rounded-xl cards, soft shadows, Framer Motion + GSAP animations

## License

MIT — built for personal portfolio use.
