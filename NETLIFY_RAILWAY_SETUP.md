# Netlify + Railway Integration Setup

## ✅ What's Been Updated

I've updated your `netlify.toml` with the following changes:

### 1. API Proxy Configuration
```toml
# API proxy to Railway backend
[[redirects]]
  from = "/api/*"
  to = "https://your-railway-app.railway.app/api/:splat"
  status = 200
  force = false
  headers = {X-From = "Netlify"}

# Health check proxy
[[redirects]]
  from = "/health"
  to = "https://your-railway-app.railway.app/health"
  status = 200
  force = false
```

### 2. Security Headers
- Updated Content Security Policy to allow Railway connections
- Added support for WebSocket connections (`wss://*.railway.app`)

### 3. Environment Variables
- All contexts now point to Railway backend
- `VITE_API_URL` updated for production, deploy-preview, and branch-deploy

## 🔧 Next Steps

### 1. Get Your Railway URL

After your Railway deployment succeeds, you'll get a URL like:
```
https://finvision-backend-production-abc123.up.railway.app
```

### 2. Update the netlify.toml

Replace `your-railway-app.railway.app` with your actual Railway URL in these locations:

```bash
# Find and replace in netlify.toml
your-railway-app.railway.app → your-actual-railway-url.railway.app
```

### 3. Set Railway Environment Variables

Make sure these are set in your Railway dashboard:

```bash
# Required
DATABASE_URL=postgresql://...  # Auto-set by Railway PostgreSQL
REDIS_URL=redis://...          # Auto-set by Railway Redis
SECRET_KEY=your-super-secret-production-key

# Frontend integration
BACKEND_CORS_ORIGINS=https://your-netlify-app.netlify.app,http://localhost:3000
FRONTEND_URL=https://your-netlify-app.netlify.app
```

### 4. Test the Integration

Once both are deployed:

1. **Frontend Health Check**: Visit `https://your-netlify-app.netlify.app/health`
   - Should proxy to Railway backend health endpoint

2. **API Calls**: Your frontend API calls to `/api/*` will automatically proxy to Railway

3. **Direct Backend**: Visit `https://your-railway-app.railway.app/docs`
   - Should show FastAPI documentation

## 🔄 Development Workflow

### Local Development
```bash
# Frontend (port 3000)
cd frontend
npm run dev

# Backend (port 8000)
cd backend
uvicorn main:app --reload
```

### Production
- **Frontend**: Auto-deploys to Netlify on git push
- **Backend**: Auto-deploys to Railway on git push
- **Proxy**: Netlify automatically forwards `/api/*` to Railway

## 🐛 Troubleshooting

### CORS Errors
```bash
# Check Railway environment variables
railway variables

# Ensure BACKEND_CORS_ORIGINS includes your Netlify URL
BACKEND_CORS_ORIGINS=https://your-netlify-app.netlify.app
```

### API Proxy Not Working
1. Check the Railway URL is correct in `netlify.toml`
2. Verify Railway backend is responding at `/health`
3. Check browser Network tab for redirect responses

### WebSocket Issues
- Railway URL in CSP allows `wss://*.railway.app`
- Frontend should connect to `wss://your-railway-app.railway.app`

## 📋 Final Checklist

- [ ] Railway backend deployed successfully
- [ ] PostgreSQL and Redis added to Railway
- [ ] Environment variables configured
- [ ] Database migrations run (`railway run alembic upgrade head`)
- [ ] Update `netlify.toml` with actual Railway URL
- [ ] Redeploy Netlify frontend
- [ ] Test API proxy functionality
- [ ] Verify CORS configuration

Once complete, your architecture will be:
```
User Request → Netlify (Frontend + Proxy) → Railway (Backend + DB + Redis)
``` 