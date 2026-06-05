# Quick Start Guide

Get the marketplace running in 5 minutes.

## Option 1: Docker Compose (Easiest)

```bash
# Copy environment template
cp .env.example .env

# Start all services
docker compose up

# Wait for services to initialize (~30 seconds)
# Open browser
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- API Docs: Check each endpoint in backend/src/routes/

**Test with demo credentials:**
- Email: `user1@example.com`
- Password: `user123`

Admin account:
- Email: `admin@example.com`
- Password: `admin123`

---

## Option 2: Manual Setup (Development)

### Backend

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Setup database (PostgreSQL must be running)
npx prisma migrate dev
npx prisma db seed

# Start dev server
npm run dev
# Runs on http://localhost:4000
```

### Frontend

```bash
cd frontend
npm install

# Create .env.local
echo 'NEXT_PUBLIC_API_URL="http://localhost:4000"' > .env.local

# Start dev server
npm run dev
# Runs on http://localhost:3000
```

---

## First Steps

1. **Create an account** at http://localhost:3000/register
2. **Create a listing** - Click "Post Listing" or go to /listings/create
3. **Upload images** - Choose up to 3 images (JPEG, PNG, WebP, max 5MB each)
4. **Search listings** - Use the search bar to find listings
5. **Browse categories** - Click category links on homepage

---

## Admin Features

Login with admin account to:

- **Manage listings**: Delete spam listings
- **Manage users**: View users and toggle bans
- **View reports**: Check reported listings

Navigate to http://localhost:3000/admin after logging in as admin.

---

## Key Files

- `backend/src/app.ts` - Express server setup
- `backend/prisma/schema.prisma` - Database schema
- `frontend/src/app/` - Next.js pages (App Router)
- `frontend/src/lib/api.ts` - Backend API client
- `docker-compose.yml` - Full stack configuration

---

## Common Tasks

### View database in Prisma Studio

```bash
cd backend
npx prisma studio
```

### Reset database

```bash
cd backend
npx prisma migrate reset
npx prisma db seed
```

### View logs

```bash
# Docker
docker compose logs backend
docker compose logs frontend
docker compose logs postgres

# Development
npm run dev  # Shows server output
```

### Add a new field to listings

1. Edit `backend/prisma/schema.prisma`
2. Run: `npx prisma migrate dev --name add_field_name`
3. Update `frontend/src/types/index.ts`
4. Update form component

---

## API Examples

### Register
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get listings
```bash
curl "http://localhost:4000/api/listings?category=FOR_SALE&city=San%20Francisco"
```

### Create listing
```bash
curl -X POST http://localhost:4000/api/listings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Used Bike" \
  -F "description=Great condition" \
  -F "price=150" \
  -F "category=FOR_SALE" \
  -F "city=San Francisco" \
  -F "contactEmail=user@example.com" \
  -F "images=@bike.jpg"
```

---

## Troubleshooting

### Port already in use
```bash
# Kill process on port
lsof -ti:3000 | xargs kill -9
lsof -ti:4000 | xargs kill -9
```

### Database connection failed
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- For Docker: `docker compose ps` should show `postgres` healthy

### Images not uploading
- Check max file size (5MB)
- Verify MIME type is image/*
- Check backend/uploads/ directory exists

### Login not working
- Clear browser cache/localStorage
- Check if user exists in database
- Verify JWT_SECRET is set

### Forgot password
- No password reset implemented (for simplicity)
- Use Prisma Studio to reset: `npx prisma studio`
- Or manually update password hash in database

---

## Next Steps

1. Customize styling in `frontend/tailwind.config.ts`
2. Add categories in `frontend/src/types/index.ts` + database schema
3. Implement email notifications (add nodemailer)
4. Add payment processing (Stripe integration)
5. Deploy to production (see DEPLOYMENT.md)

---

## Need Help?

- Check README.md for full documentation
- Review DEPLOYMENT.md for production setup
- Check backend routes in `backend/src/routes/`
- Review React components in `frontend/src/components/`

Happy listing! 🚀
