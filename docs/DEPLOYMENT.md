# Deployment Guide

## 1. Neon PostgreSQL

1. Create a project at [neon.tech](https://neon.tech)
2. Copy the connection string
3. Set as `DATABASE_URL` (append `?sslmode=require` if missing)

```bash
npx prisma migrate deploy --schema=prisma/schema.prisma
npm run prisma:seed
```

## 2. Backend (Railway)

1. New project → Deploy from GitHub repo `angkasaprwr/web-portofolio`
2. Set root directory to `server` **or** use a custom start command from repo root
3. Environment variables:

```
DATABASE_URL=postgresql://...@neon.../neondb?sslmode=require
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-app.vercel.app
JWT_ACCESS_SECRET=<long-random>
JWT_REFRESH_SECRET=<long-random>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<strong-password>
UPLOAD_DIR=uploads
```

4. Build / start (from `server`):

```
npm install
npx prisma generate --schema=../prisma/schema.prisma
node src/server.js
```

5. Persist the `uploads/` volume (Railway volume mount) or migrate to Cloudinary later.

### Render alternative

- Web Service, Node
- Build: `npm install && npx prisma generate --schema=../prisma/schema.prisma`
- Start: `node src/server.js`
- Same env vars as above

## 3. Frontend (Vercel)

1. Import repo
2. Framework: Vite
3. Root directory: `client`
4. Build command: `npm run build`
5. Output: `dist`
6. Environment:

```
VITE_API_URL=https://your-api.up.railway.app/api/v1
VITE_ASSET_URL=https://your-api.up.railway.app
```

7. Ensure `CLIENT_URL` on the backend matches the Vercel domain (CORS + cookies).

## 4. Post-deploy checklist

- [ ] Open `/api/docs` — Swagger loads
- [ ] Open public site — pages render with seed data
- [ ] Login `/admin/login`
- [ ] Upload a CV and test **Unduh CV**
- [ ] Update social links (WhatsApp / Email / GitHub / LinkedIn)
- [ ] Change default admin password
