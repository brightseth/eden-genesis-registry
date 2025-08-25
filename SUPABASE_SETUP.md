# Setting Up Supabase for Eden Genesis Registry

## Step 1: Create New Supabase Project

1. **Open Supabase Dashboard**
   ```bash
   open https://supabase.com/dashboard
   ```

2. **Create New Project** with these settings:
   - **Name**: `eden-genesis-registry` (or `eden-registry`)
   - **Database Password**: Generate a strong password and SAVE IT
   - **Region**: Choose closest to you (e.g., US West if you're on west coast)
   - **Pricing Plan**: Free tier is fine to start

3. **Wait for provisioning** (~2 minutes)

## Step 2: Get Your Database Credentials

Once project is ready:

1. Go to **Settings** (gear icon) → **Database**

2. Find the **Connection String** section

3. Look for **"Connection pooling"** section and copy the **Transaction** mode URL

4. It will look like:
   ```
   postgresql://postgres.[PROJECT_REF]:[YOUR_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

5. **IMPORTANT**: Replace `[YOUR_PASSWORD]` with the password you created in Step 1

## Step 3: Save Credentials

Create a file `.env.production.local` (git-ignored) and save:

```bash
# Production Database (Supabase)
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[YOUR_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Also get these from Settings > API
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON_KEY]"
SUPABASE_SERVICE_KEY="[SERVICE_KEY]"
```

## Step 4: What to Share

Once you have the project created, share with me:

1. The **Connection pooling URL** (with password)
2. The **Project URL** (https://[PROJECT_REF].supabase.co)
3. Optionally the anon/service keys if you want to use Supabase features

Then I can:
- Push the schema
- Migrate the data
- Set up Vercel
- Deploy everything

---

**Note**: The connection string is sensitive. Only share it in a secure way or we can add it directly to Vercel.