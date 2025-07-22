# Railway Deployment Guide

## Quick Fix for Current Build Error

The "Error creating build plan with Railpack" occurs because Railway can't auto-detect your Python FastAPI app. I've added the necessary configuration files to fix this.

## Files Added

1. **`backend/railway.toml`** - Railway-specific configuration
2. **`backend/nixpacks.toml`** - Build configuration for Nixpacks
3. **`backend/Procfile`** - Process definitions for web and worker
4. **Updated `requirements.txt`** - Added gunicorn for production

## Deployment Steps

### 1. Set Up Railway Project

```bash
# Install Railway CLI (if not already installed)
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project (run from backend directory)
cd backend
railway init
```

### 2. Configure Environment Variables

In Railway dashboard, set these environment variables:

**Required:**
```
DATABASE_URL=postgresql://postgres:password@postgres:5432/finvision
REDIS_URL=redis://redis:6379
SECRET_KEY=your-super-secret-key-for-production-make-it-very-long-and-random
```

**Optional (with defaults):**
```
BACKEND_CORS_ORIGINS=https://your-netlify-app.netlify.app,http://localhost:3000
FRONTEND_URL=https://your-netlify-app.netlify.app
MAX_FILE_SIZE=10485760
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 3. Add Database and Redis

1. In Railway dashboard:
   - Click "New" → "Database" → "Add PostgreSQL"
   - Click "New" → "Database" → "Add Redis"

2. The `DATABASE_URL` and `REDIS_URL` will be automatically set

### 4. Deploy

```bash
# Deploy from backend directory
railway up
```

### 5. Run Database Migrations

After first deployment:

```bash
# Connect to Railway and run migrations
railway run alembic upgrade head
```

## Expected Results

- ✅ Web service will start on `uvicorn main:app --host 0.0.0.0 --port $PORT`
- ✅ Health check available at `/health`
- ✅ API docs at `/docs`
- ✅ Auto-restart on failure

## Separate Worker Deployment (Optional)

For Celery background tasks, create a second Railway service:

1. Duplicate your project in Railway
2. Set the start command to: `celery -A app.core.celery_app worker --loglevel=info`
3. Use the same database and Redis connections

## Troubleshooting

**Build still fails?**
- Ensure you're deploying from the `backend/` directory
- Check that all config files are in the `backend/` folder

**Database connection issues?**
- Verify `DATABASE_URL` environment variable is set
- Check that PostgreSQL service is running in Railway

**Import errors?**
- Make sure all dependencies are in `requirements.txt`
- Check Python version compatibility (using Python 3.11)

## Next Steps

Once deployed, update your Netlify frontend configuration to point to your Railway backend URL. 