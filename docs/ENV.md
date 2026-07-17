# Example production env for server
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-frontend.vercel.app
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
