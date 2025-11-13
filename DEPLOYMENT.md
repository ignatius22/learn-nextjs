# Deployment Guide

This guide covers deploying the Next.js Invoice Management application to various platforms.

## Table of Contents

1. [Vercel Deployment](#vercel-deployment)
2. [Docker Deployment](#docker-deployment)
3. [Environment Variables](#environment-variables)
4. [Database Setup](#database-setup)

---

## Vercel Deployment

### Prerequisites

- Vercel account
- PostgreSQL database (Vercel Postgres, Neon, or any provider)

### Steps

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Connect your repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your Git repository

3. **Configure Environment Variables**

   Add these in Vercel Dashboard → Project Settings → Environment Variables:

   ```env
   POSTGRES_URL=your-postgres-connection-string
   AUTH_SECRET=your-32-char-secret (generate with: openssl rand -base64 32)
   AUTH_URL=https://your-domain.vercel.app
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

### GitHub Integration

The project includes a GitHub Actions workflow that automatically deploys to Vercel on push to `main` branch.

To enable:
1. Add these secrets to your GitHub repository:
   - `VERCEL_TOKEN` - Get from Vercel Account Settings → Tokens
   - `VERCEL_ORG_ID` - Found in Vercel project settings
   - `VERCEL_PROJECT_ID` - Found in Vercel project settings

---

## Docker Deployment

### Development Environment

Start development environment with PostgreSQL:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

This starts only the PostgreSQL database. Run the Next.js app locally:

```bash
npm install
npm run dev
```

### Production Environment

Build and run the full production stack:

```bash
# Create .env file with production values
cp .env.example .env

# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Docker Commands

```bash
# Build only
docker-compose build

# Rebuild without cache
docker-compose build --no-cache

# View running containers
docker-compose ps

# Execute commands in container
docker-compose exec app sh

# View database logs
docker-compose logs postgres
```

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `AUTH_SECRET` | NextAuth secret (32+ chars) | Generate with `openssl rand -base64 32` |
| `NODE_ENV` | Environment mode | `production` or `development` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AUTH_URL` | Application URL | `http://localhost:3000` |
| `RESEND_API_KEY` | Resend API key for emails | - |
| `FROM_EMAIL` | Sender email address | - |
| `NEXT_PUBLIC_APP_URL` | Public app URL | - |

---

## Database Setup

### Vercel Postgres

1. Create database in Vercel Dashboard
2. Copy connection string
3. Run migrations:
   ```bash
   psql $POSTGRES_URL -f db/migrations/001_initial_schema.sql
   ```

### Other PostgreSQL Providers

Compatible with:
- Neon
- Supabase
- Railway
- Render
- AWS RDS
- DigitalOcean Managed Databases

### Migration Steps

1. Connect to your database
2. Run the migration script:
   ```bash
   psql $POSTGRES_URL -f db/migrations/001_initial_schema.sql
   ```
3. Verify tables were created:
   ```sql
   \dt
   ```

### Seed Data (Optional)

Populate with sample data via API:

```bash
curl -X GET https://your-domain.vercel.app/api/seed
```

---

## Health Checks

The application includes a health check endpoint:

```bash
curl https://your-domain.vercel.app/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "checks": {
    "database": "ok"
  }
}
```

---

## Monitoring

### Vercel Analytics

Enable in Vercel Dashboard → Analytics to track:
- Page views
- Performance metrics
- Web Vitals

### Logs

- **Vercel**: View logs in Dashboard → Deployments → Logs
- **Docker**: `docker-compose logs -f app`

---

## Troubleshooting

### Build Failures

1. Check environment variables are set
2. Verify database connection string format
3. Review build logs for specific errors

### Database Connection Issues

1. Verify `POSTGRES_URL` is correct
2. Check database is accessible from deployment environment
3. Ensure SSL is enabled if required (`?ssl=require`)

### Docker Issues

1. Check port availability: `lsof -i :3000`
2. Verify Docker daemon is running
3. Check container logs: `docker-compose logs app`

---

## Security Checklist

Before deploying to production:

- [ ] Change default database password
- [ ] Generate new `AUTH_SECRET` (32+ characters)
- [ ] Enable HTTPS/SSL
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS if needed
- [ ] Review and update security headers
- [ ] Enable rate limiting
- [ ] Set up database backups
- [ ] Configure monitoring/alerting

---

## Performance Optimization

1. **Enable caching**
   - Configure Redis for session storage
   - Implement API response caching

2. **Database optimization**
   - Verify indexes are created (see migration script)
   - Monitor slow queries
   - Consider connection pooling (PgBouncer)

3. **CDN Configuration**
   - Vercel automatically uses Edge Network
   - For custom deployments, configure CloudFlare or similar

---

## Scaling

### Vercel

Vercel automatically scales. Configure in project settings:
- Function memory allocation
- Function timeout
- Concurrent executions

### Docker

Use Docker Swarm or Kubernetes for orchestration:

```bash
# Docker Swarm example
docker swarm init
docker stack deploy -c docker-compose.yml nextjs-app
```

---

## Support

For deployment issues:
1. Check [Next.js deployment documentation](https://nextjs.org/docs/deployment)
2. Review [Vercel documentation](https://vercel.com/docs)
3. Open an issue in the repository
