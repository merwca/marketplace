# Project Structure

Complete directory layout of the marketplace application.

```
marketplace/
│
├── README.md                 # Main documentation
├── QUICKSTART.md            # Get started in 5 minutes
├── DEPLOYMENT.md            # Production deployment guide
├── PROJECT_STRUCTURE.md     # This file
├── docker-compose.yml       # Full-stack Docker configuration
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore patterns
│
├── backend/                 # Express.js + Node.js API
│   ├── package.json         # Backend dependencies
│   ├── tsconfig.json        # TypeScript config
│   ├── Dockerfile           # Docker image for backend
│   ├── .env.example         # Backend env template
│   │
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema (7 enums, 3 models)
│   │   └── seed.ts          # Database seeding script
│   │
│   ├── src/
│   │   ├── app.ts           # Express app entry point
│   │   │
│   │   ├── controllers/     # Business logic handlers
│   │   │   ├── auth.controller.ts      # Login/register/me
│   │   │   ├── listing.controller.ts   # CRUD + search + reports
│   │   │   ├── user.controller.ts      # Profile + settings
│   │   │   └── admin.controller.ts     # Moderation features
│   │   │
│   │   ├── middleware/      # Express middleware
│   │   │   ├── auth.middleware.ts      # JWT verification
│   │   │   ├── admin.middleware.ts     # Admin role check
│   │   │   ├── validate.middleware.ts  # Zod validation factory
│   │   │   └── upload.middleware.ts    # Multer file uploads
│   │   │
│   │   ├── routes/          # API endpoint definitions
│   │   │   ├── auth.routes.ts          # /api/auth/*
│   │   │   ├── listing.routes.ts       # /api/listings/*
│   │   │   ├── user.routes.ts          # /api/users/*
│   │   │   └── admin.routes.ts         # /api/admin/*
│   │   │
│   │   ├── utils/           # Utility functions
│   │   │   ├── jwt.ts                  # Token generation/verify
│   │   │   ├── hash.ts                 # bcryptjs wrappers
│   │   │   └── validation.ts           # Zod schemas
│   │   │
│   │   └── types/
│   │       └── index.ts     # TypeScript interfaces
│   │
│   └── uploads/             # Local image storage directory
│
├── frontend/                # Next.js 15 + React 19 UI
│   ├── package.json         # Frontend dependencies
│   ├── tsconfig.json        # TypeScript config
│   ├── next.config.ts       # Next.js configuration
│   ├── tailwind.config.ts   # Tailwind CSS theme
│   ├── postcss.config.js    # PostCSS plugins
│   ├── Dockerfile           # Docker image for frontend
│   ├── .env.local.example   # Frontend env template
│   │
│   ├── public/              # Static assets (placeholder)
│   │
│   └── src/
│       ├── app/             # Next.js App Router pages
│       │   ├── layout.tsx       # Root layout with AuthProvider
│       │   ├── page.tsx         # Homepage with categories
│       │   ├── globals.css      # Global styles + Tailwind
│       │   │
│       │   ├── login/
│       │   │   └── page.tsx     # Login form + demo creds
│       │   │
│       │   ├── register/
│       │   │   └── page.tsx     # Registration form
│       │   │
│       │   ├── search/
│       │   │   └── page.tsx     # Search results with filters
│       │   │
│       │   ├── categories/
│       │   │   └── [slug]/
│       │   │       └── page.tsx # Category browse page
│       │   │
│       │   ├── listings/
│       │   │   ├── create/
│       │   │   │   └── page.tsx # Create listing form
│       │   │   │
│       │   │   └── [id]/
│       │   │       ├── page.tsx # Listing detail + report
│       │   │       │
│       │   │       └── edit/
│       │   │           └── page.tsx # Edit & delete listing
│       │   │
│       │   ├── dashboard/
│       │   │   ├── page.tsx         # My listings list
│       │   │   │
│       │   │   └── settings/
│       │   │       └── page.tsx     # Profile settings
│       │   │
│       │   └── admin/
│       │       ├── page.tsx         # Admin dashboard
│       │       │
│       │       ├── listings/
│       │       │   └── page.tsx     # Manage all listings
│       │       │
│       │       └── users/
│       │           └── page.tsx     # Manage users + bans
│       │
│       ├── components/      # Reusable React components
│       │   ├── layout/
│       │   │   ├── Header.tsx       # Navigation header
│       │   │   └── Footer.tsx       # Footer links
│       │   │
│       │   ├── ui/          # Base UI components
│       │   │   ├── Button.tsx       # Variant + size props
│       │   │   ├── Input.tsx        # Form input with label
│       │   │   └── Alert.tsx        # Alert notifications
│       │   │
│       │   ├── listings/    # Listing-specific components
│       │   │   ├── ListingCard.tsx       # Single listing card
│       │   │   ├── ListingGrid.tsx       # Grid of listings
│       │   │   ├── ListingForm.tsx       # Create/edit form
│       │   │   └── ImageUpload.tsx       # Image upload with preview
│       │   │
│       │   └── search/      # Search components
│       │       ├── SearchBar.tsx    # Search input box
│       │       └── FilterPanel.tsx  # Category + city filters
│       │
│       ├── lib/             # Utilities & context
│       │   ├── api.ts           # Typed fetch wrapper for backend
│       │   ├── auth.tsx         # AuthContext + useAuth hook
│       │   └── utils.ts         # Helpers (formatPrice, formatDate)
│       │
│       └── types/
│           └── index.ts     # Shared TypeScript types
│
└── (uploads)                # Ignored, created at runtime for images
```

---

## Key Statistics

| Aspect | Count |
|--------|-------|
| **Backend routes** | 14 endpoints |
| **Frontend pages** | 13 routes |
| **React components** | 12 components |
| **Database models** | 3 models (User, Listing, Report) |
| **API enums** | 2 (Category: 7 values, Role: 2 values) |
| **Middleware layers** | 4 middleware |
| **Controllers** | 4 controller modules |
| **Validation schemas** | 7 Zod schemas |
| **Total files** | 100+ TypeScript/React files |

---

## Technology Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | Next.js | 15.1.0 |
| **UI Framework** | React | 19.0 RC |
| **Styling** | Tailwind CSS | 3.4 |
| **Backend** | Express | 4.18 |
| **Runtime** | Node.js | 20+ |
| **Language** | TypeScript | 5.3 |
| **Database** | PostgreSQL | 16 |
| **ORM** | Prisma | 5.10 |
| **Auth** | JWT + bcryptjs | - |
| **File Upload** | Multer | 1.4 |
| **Validation** | Zod | 3.22 |
| **Security** | Helmet | 7.1 |

---

## API Endpoints

### Authentication (3)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Listings (6)
- `GET /api/listings` (with filters)
- `GET /api/listings/:id`
- `POST /api/listings` (multipart)
- `PUT /api/listings/:id`
- `DELETE /api/listings/:id`
- `POST /api/listings/:id/report`

### Users (3)
- `GET /api/users/me`
- `PUT /api/users/me`
- `GET /api/users/me/listings`

### Admin (4)
- `GET /api/admin/listings`
- `DELETE /api/admin/listings/:id`
- `GET /api/admin/users`
- `PUT /api/admin/users/:id/ban`

---

## Environment Variables

### Backend (.env)
```
DATABASE_URL              PostgreSQL connection string
JWT_SECRET               Secret key for signing tokens
NODE_ENV                development | production
PORT                     Server port (default 4000)
FRONTEND_URL             Frontend origin for CORS
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL      Backend API URL
```

---

## Database Schema

### User
- id: String (cuid)
- email: String (unique)
- password: String (hashed)
- name: String
- role: Enum(USER | ADMIN)
- banned: Boolean
- createdAt, updatedAt: DateTime
- listings: Listing[]
- reports: Report[]

### Listing
- id: String (cuid)
- title: String
- description: String (max 5000)
- price: Decimal? (nullable)
- category: Enum (7 values)
- city: String
- images: String[] (filenames)
- contactEmail: String
- active: Boolean
- createdAt, updatedAt: DateTime
- userId: String (foreign key)
- user: User
- reports: Report[]

### Report
- id: String (cuid)
- reason: String (max 500)
- createdAt: DateTime
- listingId: String (foreign key)
- listing: Listing
- userId: String (foreign key)
- user: User

---

## Docker Services

### postgres
- Image: postgres:16-alpine
- Port: 5432
- Database: marketplace
- Auto-initialization on first run

### backend
- Build: ./backend/Dockerfile
- Port: 4000
- Depends on: postgres
- Hot-reload: src/ mounted as volume

### frontend
- Build: ./frontend/Dockerfile
- Port: 3000
- Depends on: backend
- Hot-reload: src/ mounted as volume

---

## Development Commands

```bash
# Backend
npm install              # Install dependencies
npm run dev              # Start dev server (ts-node)
npm run build            # Compile TypeScript
npm start                # Run compiled JS

# Frontend
npm install              # Install dependencies
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm start                # Serve production build

# Database
npx prisma migrate dev   # Create and run migrations
npx prisma studio       # Open Prisma Studio
npx prisma db seed      # Run seed script
npx prisma db reset     # Reset database

# Docker
docker compose up        # Start all services
docker compose down      # Stop all services
docker compose logs      # View logs
```

---

## Deployment Targets

| Component | Recommended | Alternative |
|-----------|-------------|-------------|
| **Frontend** | Vercel | Netlify, Railway, Render |
| **Backend** | Railway | Render, Fly.io, Heroku |
| **Database** | Railway PostgreSQL | Neon, Supabase, AWS RDS |
| **Images** | Local storage | Cloudinary, AWS S3 |

See DEPLOYMENT.md for detailed instructions.

---

## Code Organization Principles

1. **Separation of Concerns**
   - Controllers: business logic
   - Routes: endpoint definitions
   - Middleware: cross-cutting concerns
   - Utils: reusable functions

2. **Type Safety**
   - Full TypeScript coverage
   - Zod validation for inputs
   - Typed API responses

3. **Minimal Dependencies**
   - Core libraries only
   - No heavy UI frameworks
   - Focus on performance

4. **Component Reusability**
   - UI components in `components/ui/`
   - Domain components in feature folders
   - Shared utilities in `lib/`

5. **API-First Design**
   - REST endpoints well-documented
   - Consistent response format
   - Clear error handling

---

## Extending the Application

### Add a new feature
1. Update Prisma schema if needed
2. Create migration: `npx prisma migrate dev`
3. Add controller logic
4. Create API routes
5. Build frontend pages/components
6. Update TypeScript types

### Add authentication provider
1. Update auth.controller.ts
2. Add provider-specific utils
3. Update frontend auth.tsx
4. Add social login button

### Switch to Cloudinary
1. Replace upload.middleware.ts
2. Update listing.controller.ts image handling
3. Update ListingCard image URL
4. Add Cloudinary credentials to .env

---

## Performance Optimizations Already Implemented

- ✅ Rate limiting (100 req/15min global)
- ✅ Helmet security headers
- ✅ CORS protection
- ✅ Parameterized queries (Prisma)
- ✅ Server-side pagination
- ✅ Database indexes on foreign keys
- ✅ Next.js Server Components for SSR
- ✅ CSS bundling with Tailwind
- ✅ Minimal JavaScript (no animations)

---

## Next Feature Ideas

1. Email notifications (nodemailer)
2. Advanced search with filters
3. Saved listings / favorites
4. User messaging system
5. Payment processing (Stripe)
6. Google Maps integration
7. Image optimization (Next.js Image)
8. Real-time notifications (WebSockets)
9. SEO improvements (meta tags)
10. Analytics integration
