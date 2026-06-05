# Marketplace — Ultra-Minimal Craigslist Clone

A fast, lightweight, text-focused marketplace web application inspired by Craigslist. Built for speed and simplicity with zero bloat.

## Features

- **Authentication**: Register, login, JWT-based sessions
- **Listings**: Create, edit, delete, search, filter by category and location
- **Images**: Upload up to 3 images per listing (local storage)
- **Categories**: For Sale, Housing, Jobs, Services, Community, Vehicles, Electronics
- **Search & Filter**: Keyword search, category filter, location filter
- **User Dashboard**: Manage your listings, update profile
- **Admin Panel**: Delete spam, ban users, moderate reports
- **Mobile Responsive**: Works perfectly on all devices
- **SEO Optimized**: Server-rendered pages for better search visibility

## Tech Stack

**Backend**
- Express.js + Node.js
- PostgreSQL + Prisma ORM
- JWT authentication with bcrypt
- Multer for image uploads

**Frontend**
- Next.js 15 (App Router)
- React 19
- Tailwind CSS
- TypeScript

**Infrastructure**
- Docker & Docker Compose
- PostgreSQL 16

## Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Or: Node.js 20+, PostgreSQL 16

### Using Docker Compose (Recommended)

```bash
# Clone and setup
cp .env.example .env

# Start all services
docker compose up

# Backend runs at http://localhost:4000
# Frontend runs at http://localhost:3000
# PostgreSQL at localhost:5432
```

Database will auto-initialize on first run. Seed data includes 1 admin + 2 users + 12 listings.

### Manual Setup (Without Docker)

**Backend:**
```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev  # runs on port 4000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev  # runs on port 3000
```

## Default Credentials

After running seed:

```
Admin User:
  Email: admin@example.com
  Password: admin123

Test User 1:
  Email: user1@example.com
  Password: user123

Test User 2:
  Email: user2@example.com
  Password: user123
```

## API Endpoints

### Authentication
- `POST /api/auth/register` — Create new account
- `POST /api/auth/login` — Login and get JWT token
- `GET /api/auth/me` — Get current user (requires token)

### Listings
- `GET /api/listings` — List all (supports ?q=, ?category=, ?city=, ?page=, ?limit=)
- `POST /api/listings` — Create new listing (requires auth, multipart/form-data)
- `GET /api/listings/:id` — Get single listing
- `PUT /api/listings/:id` — Update listing (owner only)
- `DELETE /api/listings/:id` — Delete listing (owner only)

### User
- `GET /api/users/me` — Get profile
- `PUT /api/users/me` — Update profile/password
- `GET /api/users/me/listings` — Get my listings

### Reports
- `POST /api/listings/:id/report` — Report a listing

### Admin
- `GET /api/admin/listings` — List all (supports ?active=, ?reported=)
- `DELETE /api/admin/listings/:id` — Delete listing
- `GET /api/admin/users` — List all users
- `PUT /api/admin/users/:id/ban` — Toggle user ban

## Frontend Routes

- `/` — Homepage (featured listings)
- `/login` — Login page
- `/register` — Registration page
- `/listings/[id]` — Listing detail
- `/listings/create` — Create new listing
- `/listings/[id]/edit` — Edit listing
- `/categories/[slug]` — Browse by category
- `/search` — Search results
- `/dashboard` — User dashboard (my listings)
- `/dashboard/settings` — Profile settings
- `/admin` — Admin dashboard
- `/admin/listings` — Manage all listings
- `/admin/users` — Manage users

## Project Structure

```
marketplace/
├── backend/
│   ├── prisma/               Database schema & migrations
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── controllers/      Business logic for each resource
│   │   ├── middleware/       Auth, validation, rate limiting
│   │   ├── routes/           API route definitions
│   │   ├── types/            TypeScript type definitions
│   │   └── app.ts            Express app entry point
│   ├── uploads/              Uploaded image storage
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/              Next.js App Router pages
│   │   ├── components/       React components
│   │   ├── lib/              Utilities (API client, auth context)
│   │   ├── types/            TypeScript types
│   │   └── public/           Static assets
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```

## Environment Variables

See `.env.example`. Key variables:

- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Secret key for signing tokens (change in production!)
- `NODE_ENV` — `development` or `production`
- `NEXT_PUBLIC_API_URL` — Backend API URL for frontend

## Security Features

- HTTPS-ready (reverse proxy recommended)
- JWT token-based auth
- bcryptjs password hashing
- Helmet.js security headers
- CORS protection
- Rate limiting (100 req/15min global, 10 req/15min on auth)
- SQL injection prevention (Prisma parameterization)
- XSS protection (React escaping)
- Input validation (Zod schemas)

## Deployment

### Frontend (Vercel)

```bash
cd frontend
# Push to GitHub, connect to Vercel
# Set env var: NEXT_PUBLIC_API_URL=https://your-backend.com
```

### Backend (Railway or Render)

```bash
# Push to GitHub
# Deploy with Dockerfile
# Set env vars: DATABASE_URL, JWT_SECRET, NODE_ENV=production
```

### Database (Railway, Neon, or Supabase)

- Create PostgreSQL database
- Update DATABASE_URL in backend
- Run migrations: `npx prisma migrate deploy`
- Optionally seed: `npx prisma db seed` (dev only)

## Development

### Adding a new listing field

1. Update `prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev --name add_field_name`
3. Update backend controller
4. Update frontend form

### Changing authentication

JWT tokens are stored in browser localStorage. To switch strategies:

1. Modify `frontend/src/lib/auth.tsx`
2. Update `frontend/src/lib/api.ts` token attachment
3. Update backend auth middleware

## Performance Optimizations

- Server-side rendering for SEO pages
- Minimal dependencies
- CSS bundling (Tailwind)
- Database query optimization via Prisma
- Image sizing (users upload appropriately)
- Rate limiting to prevent abuse

## License

MIT

## Support

For issues or questions:
- Check existing docs
- Review error logs: `docker compose logs`
- Backend debug: enable `DEBUG=* npm run dev`
