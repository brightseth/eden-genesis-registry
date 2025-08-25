# Getting Your Supabase Connection String

## After Saving Connection Pooling Settings:

1. **Stay in Settings → Database**

2. **Scroll to "Connection string" section**

3. **Look for the dropdown that says "Mode"** and select **"Transaction"**

4. **Copy the connection string** - it looks like:
   ```
   postgresql://postgres.[PROJECT_REF]:[YOUR_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

5. **IMPORTANT**: The password might show as dots. You need to:
   - Either click the "Reveal" button to show the password
   - Or manually replace `[YOUR-PASSWORD]` with the password you created when making the project

## The final URL should look like:
```
postgresql://postgres.abcdefghijklmnop:YourActualPassword123@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

## Also Get (from Settings → API):
- **Project URL**: `https://[PROJECT_REF].supabase.co`
- **Anon Key**: The `anon` public key (safe to expose)
- **Service Key**: The `service_role` key (keep secret!)

Share the connection string and I'll set everything up!