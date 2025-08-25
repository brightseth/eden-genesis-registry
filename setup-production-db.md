# Setting Up Production Database for Eden Genesis Registry

## Option 1: Supabase (Recommended - Free Tier)

1. Go to https://supabase.com
2. Sign in/Create account
3. Click "New Project"
4. Settings:
   - Organization: Select or create
   - Project Name: `eden-genesis-registry`
   - Database Password: Generate strong password (save this!)
   - Region: Choose closest to your users
   - Pricing Plan: Free tier is fine

5. Wait for project to provision (~2 minutes)

6. Go to Settings > Database
7. Copy the "Connection string" under "Connection Pooling" section
   - Use the "Transaction" mode
   - It will look like: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true`

8. Add to Vercel:
```bash
npx vercel env add DATABASE_URL production
# Paste the connection string when prompted
```

## Option 2: Neon (Alternative - Free Tier)

1. Go to https://neon.tech
2. Sign up/Sign in
3. Create new project: `eden-genesis-registry`
4. Copy the connection string
5. Add to Vercel as above

## Option 3: Vercel Postgres (If you have Pro account)

1. Go to Vercel Dashboard
2. Select your project
3. Go to Storage tab
4. Create Database > Postgres
5. Follow setup wizard
6. DATABASE_URL will be automatically added

## After Database Setup

1. Run migrations:
```bash
# Set the DATABASE_URL locally
export DATABASE_URL="your-connection-string"

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Or run migrations
npx prisma migrate deploy
```

2. Seed initial data (optional):
```bash
npx prisma db seed
```

3. Redeploy to Vercel:
```bash
npx vercel --prod
```

## Test the deployment:
```bash
curl https://eden-genesis-registry.vercel.app/api/v1/status
```

Should return:
```json
{
  "status": "healthy",
  "database": "connected",
  ...
}
```