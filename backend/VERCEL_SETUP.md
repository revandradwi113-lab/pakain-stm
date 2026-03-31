# VERCEL ENVIRONMENT VARIABLES SETUP

## ⚠️ IMPORTANT: Follow these steps to fix FUNCTION_INVOCATION_FAILED error

### 1. Get your Vercel Project URL
- Go to https://vercel.com/dashboard
- Select your project 
- Copy the Production URL (e.g., `https://toko-pakaian.vercel.app`)

### 2. Set Environment Variables in Vercel Dashboard

Go to: **Project Settings → Environment Variables**

Add these variables for **Production**:

```
PORT = 5000
NODE_ENV = production
FRONTEND_URL = https://your-vercel-domain.vercel.app

PGHOST = aws-1-ap-south-1.pooler.supabase.com
PGPORT = 5432
PGUSER = postgres.qzlkrkbwtoyfzkvpsgzc
PGPASSWORD = [Your Supabase password from .env]
PGDATABASE = postgres

SUPABASE_URL = [Your Supabase URL]
SUPABASE_ANON_KEY = [Your Supabase ANON KEY]
SUPABASE_SERVICE_ROLE_KEY = [Your Supabase SERVICE ROLE KEY]

JWT_SECRET = [Create a new production secret]
JWT_EXPIRE = 7d

CORS_ORIGIN = https://your-vercel-domain.vercel.app
```

**⚠️ DO NOT commit real secrets to GitHub!**
- Get these values from your local `.env` file
- Only paste them in Vercel dashboard (they are private)


### 3. Important Notes

⚠️ **Replace `your-vercel-domain.vercel.app` with your actual Vercel domain**

- FRONTEND_URL = your React app deployed on Vercel
- CORS_ORIGIN = same as FRONTEND_URL
- Keep other variables same as in local .env

### 4. If still getting error:

1. **Check Vercel Logs:**
   - Go to Deployments → Click latest deployment → Logs
   - Look for database connection errors

2. **Common issues:**
   - Supabase IP whitelist (add Vercel IP ranges)
   - Database credentials wrong
   - Connection timeout (try using pgBouncer)

### 5. After setting variables:

- Go to Deployments
- Redeploy latest commit
- Check in Vercel Logs for "✅ Database connected successfully"

