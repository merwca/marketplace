# Deployment Guide

## Overview

This guide covers deploying the Marketplace application to different environments.

## Development Setup

### Local Development with Docker Compose

```bash
# Clone the repository
git clone <repository>
cd marketplace

# Start all services
docker-compose up

# The app will be available at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:4000
```

**Database Setup:**
```bash
# Run database migrations and seed data
cd backend
npm run db:seed
```

## Production Deployment

### Architecture Recommendation

For production, use a **reverse proxy** (nginx/Apache) to serve both frontend and backend from the same origin:

```
┌─────────────────┐
│   Browser       │
└────────┬────────┘
         │
    ┌────▼─────────────────────────┐
    │   Reverse Proxy (nginx)      │
    │ • Serves static files        │
    │ • Proxies /api/* to backend  │
    └────┬──────────────────────┬──┘
         │                      │
    ┌────▼──────┐          ┌───▼────────┐
    │ Frontend   │          │  Backend   │
    │ (Next.js)  │          │  (Node.js) │
    └───────────┘          └────────────┘
```

### Benefits of Reverse Proxy Approach

✅ **Single Origin**: Frontend and backend on same domain
✅ **CORS-Free**: No CORS issues with relative paths
✅ **Flexible**: Easy to change API location without rebuilding
✅ **Performance**: Can add caching layers
✅ **Security**: Hide internal service locations

### Configuration by Deployment Type

#### Option 1: Reverse Proxy (Recommended for Production)

**Environment Variables:**
```bash
NEXT_PUBLIC_API_URL=          # Leave empty - use relative paths
JWT_SECRET=<strong-random>    # Generate: openssl rand -base64 32
DATABASE_URL=postgresql://... # Your production database
NODE_ENV=production
```

**Nginx Configuration Example:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Serve frontend
    location / {
        proxy_pass http://frontend:3000;
    }

    # Proxy API requests
    location /api/ {
        proxy_pass http://backend:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Serve uploaded images
    location /uploads/ {
        proxy_pass http://backend:4000;
    }
}
```

#### Option 2: Separate Domains

**Frontend Environment:**
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

**Backend Configuration:**
- Enable CORS for `https://www.yourdomain.com`
- Add to `backend/src/app.ts`:
```typescript
app.use(cors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true
}));
```

## Docker Production Build

### Multi-Stage Build (Optimized for Production)

**Backend Dockerfile:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/app.js"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/.next ./.next
COPY public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

### Deploy Commands

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Run containers
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

## Security Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Use strong database password
- [ ] Enable HTTPS/TLS (SSL certificate)
- [ ] Set `NODE_ENV=production`
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Enable CORS properly
- [ ] Use environment variables for secrets (not in .env file)
- [ ] Keep dependencies updated
- [ ] Set up monitoring and logging
- [ ] Configure automated backups

## Environment Variables

### Required for Production

```bash
# Backend
DATABASE_URL=postgresql://user:password@host:5432/marketplace
JWT_SECRET=<strong-random-secret>
NODE_ENV=production
PORT=4000

# Frontend
NEXT_PUBLIC_API_URL=  # Leave empty for reverse proxy, or set to API URL
```

### Optional

```bash
# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
FRONTEND_PORT=3000

# Backend
BACKEND_PORT=4000
```

## Scaling Considerations

### Horizontal Scaling

For multiple backend instances:

1. Use a load balancer (AWS ELB, nginx, etc.)
2. Configure sticky sessions if needed
3. Ensure database can handle multiple connections
4. Use shared file storage for uploads (S3, Azure Blob, etc.)

### File Storage in Production

Currently, images are stored locally in `/uploads`. For production:

**Option 1: S3/Cloud Storage**
- Install aws-sdk
- Update upload middleware to use S3
- Update image URLs to use S3 URLs

**Option 2: Shared Filesystem**
- Mount shared volume to all backend instances
- Use NFS or distributed filesystem

**Option 3: CDN**
- Upload to CDN
- Serve images from CDN URL

## Monitoring and Logging

### Recommended Tools

- **Monitoring**: Prometheus + Grafana, DataDog, New Relic
- **Logging**: ELK Stack, Splunk, CloudWatch
- **APM**: New Relic, DataDog, Elastic APM
- **Uptime**: UptimeRobot, Pingdom

### Key Metrics

- API response times
- Database query times
- Error rates
- Uptime percentage
- CPU/Memory usage
- Database connections

## Database Backups

```bash
# Automated daily backups with pg_dump
0 2 * * * pg_dump $DATABASE_URL > /backups/marketplace-$(date +\%Y\%m\%d).sql
```

## Troubleshooting

### API URL Issues

**Symptom**: Images/API calls not working

**Solutions**:
1. Check `NEXT_PUBLIC_API_URL` matches actual backend location
2. For relative paths, ensure reverse proxy is configured
3. Check browser console for CORS errors
4. Verify backend is accessible from frontend origin

### Database Connection Issues

**Symptom**: "Cannot connect to database"

**Solutions**:
1. Verify `DATABASE_URL` is correct
2. Check database service is running
3. Verify network connectivity
4. Check database user permissions
5. Review database logs

## Rollback Procedure

```bash
# Keep previous images
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d  # Use old image tag
```

## Support

For deployment issues, check:
- Docker logs: `docker-compose logs -f service_name`
- Backend logs: In application directory
- Database logs: PostgreSQL logs
- Reverse proxy logs: nginx/Apache logs
