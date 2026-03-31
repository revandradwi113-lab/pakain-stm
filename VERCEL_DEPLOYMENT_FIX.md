# Vercel Deployment - Complete Fix Guide

## 🔴 Problem: FUNCTION_INVOCATION_FAILED (500 Error)

### Root Causes Fixed:
1. ✅ Frontend hardcoded API URL to `localhost:5000` → **NOW DYNAMIC**
2. ✅ CORS only allowing `localhost` → **NOW DYNAMIC** 
3. ✅ Backend crashes if DB unavailable → **NOW CONTINUES WITH RETRIES**
4. ✅ No Vercel configuration → **NOW HAS vercel.json**

---

## 📋 Step-by-Step Deployment Fix

### Step 1: Get Your Vercel Project Information
```
1. Go to https://vercel.com/dashboard
2. Select your project
3. Copy these URLs:
   - Production URL: https://xxxxx.vercel.app
   - Backend URL: https://xxxxx-backend.vercel.app (if deployed separately)
```

### Step 2: Push Code to GitHub with Latest Fixes
```bash
cd c:\pakain stm
git add .
git commit -m "Fix Vercel deployment issues - API URL, CORS, DB connection"
git push
```

### Step 3: Set Frontend Environment Variables in Vercel

**Dashboard → Settings → Environment Variables**

Add for **Production**:
```
REACT_APP_API_URL = https://your-backend-domain.vercel.app
```

*If your frontend and backend are on same domain:*
```
REACT_APP_API_URL = https://your-domain.vercel.app
```

### Step 4: Set Backend Environment Variables in Vercel

**Backend Project → Settings → Environment Variables**

Add for **Production**:
```
PORT = 5000
NODE_ENV = production
FRONTEND_URL = https://your-frontend-domain.vercel.app

PGHOST = aws-1-ap-south-1.pooler.supabase.com
PGPORT = 5432
PGUSER = postgres.qzlkrkbwtoyfzkvpsgzc
PGPASSWORD = [Use .env value from your local setup]
PGDATABASE = postgres

SUPABASE_URL = https://qzlkrkbwtoyfzkvpsgzc.supabase.co
SUPABASE_ANON_KEY = [Use .env value from your local setup]
SUPABASE_SERVICE_ROLE_KEY = [Use .env value from your local setup]

JWT_SECRET = [Create a new strong secret for production]
JWT_EXPIRE = 7d

CORS_ORIGIN = https://your-frontend-domain.vercel.app
```

### Step 5: Redeploy Both Projects

1. **Frontend:**
   - Go to Deployments
   - Click "Redeploy" on latest commit
   - Wait for build to complete

2. **Backend:**
   - Same as frontend
   - Wait for build to complete

### Step 6: Check Vercel Logs for Errors

**After redeploy:**
1. Frontend: Deployments → Build Logs (should say "✅ Compiled successfully")
2. Backend: Deployments → Runtime Logs (look for "✅ Database connected" or connection errors)

---

## ❌ Common Errors & Fixes

### Error 1: "FUNCTION_INVOCATION_FAILED" still showing
**Reason:** Environment variables not set
**Fix:** Double-check Step 3 & 4, then redeploy

### Error 2: "Cannot reach backend"
**Reason:** REACT_APP_API_URL is wrong
**Fix:** Make sure REACT_APP_API_URL matches your backend Vercel domain

### Error 3: "Database connection timeout"
**Reason:** Supabase blocking Vercel IP or network issue
**Fix:** 
- Check [Supabase Status](https://status.supabase.com/)
- Add Vercel IP ranges to Supabase firewall (if enabled)
- Try alternative: Use local PostgreSQL instead

### Error 4: "CORS error"
**Reason:** Frontend domain not in CORS whitelist
**Fix:** Make sure FRONTEND_URL env var is set correctly

---

## 🧪 How to Test

After redeployment, test in browser console:
```javascript
// Should return 200, not 500
fetch('https://your-backend.vercel.app/')
  .then(r => r.text())
  .then(d => console.log(d))

// Try login API
fetch('https://your-backend.vercel.app/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.com', password: 'test' })
})
  .then(r => r.json())
  .then(d => console.log(d))
```

---

## 📝 Files Modified for Vercel Compatibility

1. `backend/vercel.json` - New configuration file
2. `backend/src/server.js` - Dynamic CORS, graceful error handling
3. `backend/src/db/pool.js` - Optimized for Vercel connections
4. `login-dashboard/src/services/apiService.js` - Dynamic API URL
5. `login-dashboard/.env.production` - Production environment template

---

## 🆘 Still Having Issues?

1. **Check Supabase connection:** Are you able to ping Supabase from Vercel? (No - this was the initial problem)
   - Solution: Use Connection Pooler (which you're already using)
   
2. **Check Vercel Logs:** Most detailed error info is in Runtime Logs

3. **Try Local Test First:**
   ```bash
   npm install -g vercel
   vercel env pull
   npm start
   ```

---

## ✅ Success Checklist

- [ ] Files pushed to GitHub
- [ ] Environment variables set in Vercel (both projects)
- [ ] Both projects redeployed
- [ ] No "FUNCTION_INVOCATION_FAILED" in browser
- [ ] Can access ` https://your-domain.vercel.app/`
- [ ] Login works without errors
- [ ] Can view products without "Server error" message

