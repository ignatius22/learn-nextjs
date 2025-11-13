# Database Migrations

This directory contains SQL migration scripts for setting up and maintaining the database schema.

## Running Migrations

### Option 1: Using psql

```bash
psql $POSTGRES_URL -f db/migrations/001_initial_schema.sql
```

### Option 2: Using the seed API route

The application includes a `/api/seed` route that will populate the database with sample data.

```bash
curl http://localhost:3000/api/seed
```

## Migration Files

- `001_initial_schema.sql` - Initial database schema with tables, indexes, and constraints

## Database Schema

### Tables

1. **users** - Authentication user accounts
   - id (UUID, primary key)
   - name
   - email (unique)
   - password (hashed with bcrypt)
   - created_at, updated_at

2. **customers** - Customer records
   - id (UUID, primary key)
   - name
   - email (unique)
   - image_url
   - created_at, updated_at

3. **invoices** - Invoice records
   - id (UUID, primary key)
   - customer_id (foreign key to customers)
   - amount (in cents)
   - status ('pending' or 'paid')
   - date
   - created_at, updated_at

4. **revenue** - Monthly revenue data for charts
   - month (primary key)
   - revenue

### Indexes

Performance indexes are created on frequently queried columns:
- users.email
- customers.email, customers.name
- invoices.customer_id, invoices.status, invoices.date
- Composite index on invoices(customer_id, status)

## Security Notes

- The default admin user password should be changed immediately in production
- All passwords are hashed using bcrypt with 10 salt rounds
- Foreign key constraints prevent orphaned invoices
