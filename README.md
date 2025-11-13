# Next.js Invoice Management System

A production-ready invoice management application built with Next.js 14+, featuring authentication, CRUD operations, and a modern dashboard interface.

[![CI/CD Pipeline](https://github.com/ignatius22/learn-nextjs/actions/workflows/ci.yml/badge.svg)](https://github.com/ignatius22/learn-nextjs/actions/workflows/ci.yml)

## Features

### Core Functionality
- **Dashboard** - Real-time metrics and revenue charts
- **Invoice Management** - Create, read, update, delete invoices
- **Customer Management** - Full CRUD operations for customers
- **Authentication** - Secure login with NextAuth v5
- **Search & Pagination** - Fast search with server-side pagination

### Security Features
- Rate limiting on authentication endpoints
- Input sanitization and validation
- CSRF protection via NextAuth
- Security headers (HSTS, CSP, X-Frame-Options, etc.)
- SQL injection prevention with parameterized queries
- Bcrypt password hashing

### Production Ready
- Structured logging for production monitoring
- Docker support with multi-stage builds
- Health check endpoints
- Error boundaries and error handling
- Database migrations
- CI/CD with GitHub Actions
- Vercel deployment configuration

## Tech Stack

- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL
- **Authentication:** NextAuth v5
- **Validation:** Zod
- **Icons:** Heroicons
- **Deployment:** Vercel / Docker

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ignatius22/learn-nextjs.git
   cd learn-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your values:
   ```env
   POSTGRES_URL=postgresql://user:password@host:port/database
   AUTH_SECRET=your-32-character-secret
   AUTH_URL=http://localhost:3000
   ```

   Generate `AUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

4. **Set up the database**
   ```bash
   # Run migrations
   psql $POSTGRES_URL -f db/migrations/001_initial_schema.sql

   # Or use the seed API route
   npm run dev
   curl http://localhost:3000/api/seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   Visit [http://localhost:3000](http://localhost:3000)

   **Default credentials:**
   - Email: `user@nextmail.com` (check seed data)
   - Password: `123456` (CHANGE THIS!)

## Development

### Project Structure

```
learn-nextjs/
├── app/
│   ├── dashboard/          # Dashboard pages
│   │   ├── customers/      # Customer CRUD
│   │   ├── invoices/       # Invoice CRUD
│   │   └── (overview)/     # Dashboard home
│   ├── lib/                # Utilities and server functions
│   │   ├── actions.ts      # Server actions
│   │   ├── data.ts         # Data fetching
│   │   ├── logger.ts       # Structured logging
│   │   ├── rate-limit.ts   # Rate limiting
│   │   └── sanitize.ts     # Input sanitization
│   ├── ui/                 # React components
│   └── api/                # API routes
├── db/
│   └── migrations/         # Database migrations
├── .github/
│   └── workflows/          # CI/CD pipelines
├── auth.ts                 # NextAuth configuration
├── middleware.ts           # Route protection
├── Dockerfile              # Production Docker image
└── docker-compose.yml      # Docker services
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

### Docker Development

Start PostgreSQL only:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

Full stack with Docker:
```bash
docker-compose up -d
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ignatius22/learn-nextjs)

1. Click the button above
2. Configure environment variables
3. Deploy!

### Docker Deployment

```bash
docker-compose up -d
```

## API Documentation

### Authentication

#### POST `/api/auth/signin`
Login with credentials

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

### Health Check

#### GET `/api/health`
Check application and database health

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "checks": {
    "database": "ok"
  }
}
```

### Database Seeding

#### GET `/api/seed`
Populate database with sample data (development only)

## Security

### Security Features

- **Authentication:** NextAuth with secure session management
- **Rate Limiting:** Prevents brute force attacks (5 attempts per 15 min)
- **Input Validation:** Zod schemas validate all user inputs
- **SQL Injection Prevention:** Parameterized queries only
- **XSS Protection:** Input sanitization and Content Security Policy
- **CSRF Protection:** Built-in with NextAuth
- **Security Headers:** HSTS, X-Frame-Options, CSP, etc.

### Security Best Practices

Before deploying to production:

1. **Change default credentials**
   ```sql
   UPDATE users SET password = 'new-bcrypt-hash' WHERE email = 'admin@example.com';
   ```

2. **Generate strong AUTH_SECRET**
   ```bash
   openssl rand -base64 32
   ```

3. **Enable HTTPS** - Always use SSL in production

4. **Review environment variables** - Never commit secrets

5. **Set up database backups** - Regular automated backups

6. **Configure monitoring** - Use Vercel Analytics or similar

## Testing

### Running Tests

```bash
# Unit tests (when implemented)
npm run test

# E2E tests (when implemented)
npm run test:e2e
```

### Manual Testing Checklist

- [ ] Login/logout functionality
- [ ] Create invoice
- [ ] Edit invoice
- [ ] Delete invoice
- [ ] Create customer
- [ ] Edit customer
- [ ] Search invoices
- [ ] Search customers
- [ ] Pagination
- [ ] Rate limiting (try 6 login attempts)

## Performance

### Optimizations

- **Database Indexes:** Optimized queries with proper indexing
- **Image Optimization:** Next.js automatic image optimization
- **Code Splitting:** Automatic code splitting per route
- **Server Components:** Reduced client-side JavaScript
- **Edge Middleware:** Fast authentication checks

### Performance Metrics

Target Web Vitals:
- **LCP:** < 2.5s
- **FID:** < 100ms
- **CLS:** < 0.1

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

**Build fails with "Module not found"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Database connection error**
- Verify `POSTGRES_URL` is correct
- Check database is running
- Ensure SSL mode matches your database (`?ssl=require`)

**Authentication not working**
- Verify `AUTH_SECRET` is set (32+ characters)
- Check `AUTH_URL` matches your domain
- Clear browser cookies and try again

**Docker container won't start**
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built following the [Next.js Learn Course](https://nextjs.org/learn)
- Enhanced with production-ready features and security
- UI components inspired by [Tailwind UI](https://tailwindui.com)

## Support

- **Documentation:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues:** [GitHub Issues](https://github.com/ignatius22/learn-nextjs/issues)
- **Discussions:** [GitHub Discussions](https://github.com/ignatius22/learn-nextjs/discussions)

## Roadmap

- [ ] Unit and E2E tests
- [ ] Email notifications with Resend
- [ ] Invoice PDF export
- [ ] CSV export
- [ ] User profile management
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Audit logging
- [ ] Advanced reporting
- [ ] Dark mode

---

Made with ❤️ using Next.js 14+
