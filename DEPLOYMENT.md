# Deployment Guide

This guide covers deploying the marketplace application to production using:
- **Frontend**: Vercel
- **Backend**: Railway or Render
- **Database**: PostgreSQL (Railway, Neon, or Supabase)

## Prerequisites

- Git repository (GitHub recommended)
- Accounts on deployment platforms
- `git` and `docker` installed locally (for testing)

---

## Local Testing

Before deploying, test locally with Docker Compose:

```bash
cp .env.example .env

# Update .env with strong JWT_SECRET
JWT_SECRET="generate-a-strong-random-string"

docker compose up
```

Visit http://localhost:3000. Default credentials:
- Email: user1@example.com
- Password: user123

---

## Database Setup (Choose One)

### Option 1: Railway (Recommended)

1. Create PostgreSQL database on Railway
2. Copy the connection URL
3. Note the URL format: `postgresql://user:password@host:port/database`

### Option 2: Supabase

1. Create new project on supabase.com
2. Go to Settings → Database → Connection string
3. Copy PostgreSQL URI

### Option 3: Neon

1. Create project on neon.tech
2. Copy connection string from "Connection string" tab

---

## Backend Deployment (Railway/Render)

### On Railway

1. Push code to GitHub
2. Create new project on Railway dashboard
3. Connect GitHub repository
4. Add PostgreSQL plugin
5. Set environment variables:
   ```
   DATABASE_URL=<from railway>
   JWT_SECRET=<strong random key>
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.com
   ```
6. Railway auto-deploys on push
7. Note the backend URL (e.g., `https://marketplace-api.railway.app`)

### On Render

1. Create new Web Service
2. Connect to GitHub repo
3. Set build command: `cd backend && npm install && npm run build`
4. Set start command: `cd backend && npm start`
5. Add PostgreSQL instance
6. Set environment variables
7. Deploy

---

## Frontend Deployment (Vercel)

1. Push code to GitHub
2. Go to vercel.com → New Project
3. Import your GitHub repository
4. Framework: Next.js (auto-detected)
5. Root Directory: `frontend`
6. Build Command: `npm run build`
7. Start Command: `npm start`
8. Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```
9. Deploy

---

## Post-Deployment Steps

### 1. Run Database Migrations

After backend is deployed, run migrations:

```bash
# Via Railway/Render console or local:
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

### 2. Seed Database (Optional)

```bash
DATABASE_URL="postgresql://..." npx prisma db seed
```

### 3. Update CORS

Backend `app.ts` needs frontend URL:

```typescript
cors({ origin: "https://your-frontend.vercel.app" })
```

Update `.env` on backend:
```
FRONTEND_URL=https://your-frontend.vercel.app
```

### 4. Test Endpoints

```bash
# Test backend health
curl https://your-backend.railway.app/health

# Test login
curl -X POST https://your-backend.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user1@example.com","password":"user123"}'
```

---

## Troubleshooting

### Backend won't start
- Check DATABASE_URL format
- Ensure all environment variables are set
- Check logs: `docker logs <container_id>`

### Frontend shows 500 errors
- Verify NEXT_PUBLIC_API_URL is correct
- Check CORS on backend (update origin)
- Check browser console for errors

### Images not displaying
- Verify upload directory is writable
- Check IMAGE_URL environment variable
- Ensure file permissions on server

### Slow performance
- Add database indexes (Prisma already has them)
- Enable CDN for images (e.g., Cloudinary)
- Use Next.js Image component for optimization

### Out of disk space
- Implement image cleanup cron job
- Set max file size limits
- Monitor uploads directory

---

## Scaling Considerations

### High Traffic
- Add caching layer (Redis)
- Implement CDN for images
- Horizontal scaling with load balancer

### Database
- Enable connection pooling
- Monitor slow queries
- Archive old listings

### Security
- Enable HTTPS (automatic on Vercel/Railway)
- Implement rate limiting (already done)
- Regular security audits
- Backup database daily

---

## Monitoring

Recommended monitoring services:
- **Errors**: Sentry
- **Performance**: New Relic, Datadog
- **Uptime**: UptimeRobot, StatusPage.io
- **Logs**: Logtail, ELK Stack

---

## Rollback

If deployment fails:

```bash
# Git rollback
git revert <commit-hash>
git push

# Vercel auto-redeploys
# Railway/Render: manually select previous deployment
```

---

## Production Checklist

- [ ] Database backups configured
- [ ] Environment variables set securely
- [ ] SSL/HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting active
- [ ] Error logging active
- [ ] Monitoring set up
- [ ] Seed data removed from production
- [ ] JWT_SECRET is strong and unique
- [ ] Frontend and backend URLs match
- [ ] Image upload directory writable
- [ ] Database migrations ran successfully
