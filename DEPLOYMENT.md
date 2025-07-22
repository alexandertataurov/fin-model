# FinVision Deployment Guide

This guide covers deploying the FinVision platform to production using Netlify for the frontend and various options for the backend.

## 📋 Prerequisites

- Git repository with the FinVision codebase
- Netlify account (free tier available)
- Backend hosting platform account (Railway, Render, Heroku, etc.)
- Domain name (optional)

## 🚀 Frontend Deployment (Netlify)

### Option 1: Automatic Deployment (Recommended)

1. **Connect Repository to Netlify**

   ```bash
   # Go to https://app.netlify.com/
   # Click "New site from Git"
   # Connect your GitHub/GitLab/Bitbucket repository
   # Select the repository containing FinVision
   ```

2. **Configure Build Settings**
   Netlify will automatically detect the `netlify.toml` configuration:

   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
   - **Base directory**: `frontend`

3. **Set Environment Variables**
   In Netlify dashboard → Site settings → Environment variables:

   ```
   NODE_ENV=production
   VITE_API_URL=https://your-backend-api.com
   VITE_APP_NAME=FinVision
   VITE_APP_VERSION=1.0.0
   ```

4. **Deploy**
   ```bash
   git push origin main
   # Netlify will automatically build and deploy
   ```

### Option 2: Manual Deployment

1. **Build locally**

   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Deploy to Netlify**

   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Login to Netlify
   netlify login

   # Deploy
   netlify deploy --prod --dir=dist
   ```

### Option 3: GitHub Actions (Automated)

The project includes a GitHub Actions workflow for automated deployment:

1. **Set up secrets in GitHub repository**

   - Go to repository → Settings → Secrets and variables → Actions
   - Add these secrets:
     ```
     NETLIFY_AUTH_TOKEN=your-netlify-auth-token
     NETLIFY_SITE_ID=your-netlify-site-id
     VITE_API_URL=https://your-backend-api.com
     ```

2. **Get Netlify tokens**

   ```bash
   # Get auth token
   netlify login
   # Copy the auth token from ~/.netlify/config.json

   # Get site ID
   netlify sites:list
   # Or create a new site: netlify sites:create
   ```

3. **Push to trigger deployment**
   ```bash
   git push origin main
   # GitHub Actions will build and deploy automatically
   ```

## 🖥️ Backend Deployment

### Option 1: Railway

1. **Deploy to Railway**

   ```bash
   # Connect GitHub repository to Railway
   # Select the backend directory as the source
   # Railway will auto-detect Python and FastAPI
   ```

2. **Environment Variables**

   ```
   SECRET_KEY=your-secure-secret-key
   POSTGRES_SERVER=your-railway-postgres-host
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your-postgres-password
   POSTGRES_DB=railway
   REDIS_URL=redis://your-railway-redis-host:6379
   BACKEND_CORS_ORIGINS=https://your-netlify-site.netlify.app
   ```

3. **Database Setup**
   - Add PostgreSQL service in Railway
   - Add Redis service in Railway
   - Run migrations: `alembic upgrade head`

### Option 2: Render

1. **Create Web Service**

   - Connect repository
   - Root directory: `backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

2. **Add Database**
   - Create PostgreSQL database in Render
   - Create Redis instance in Render

### Option 3: Docker Container

1. **Build and push Docker image**

   ```bash
   cd backend
   docker build -f Dockerfile.prod -t finvision-backend .
   docker tag finvision-backend your-registry/finvision-backend
   docker push your-registry/finvision-backend
   ```

2. **Deploy to container platform**
   - AWS ECS/Fargate
   - Google Cloud Run
   - Azure Container Instances

## 🔧 Configuration

### Frontend Environment Variables

| Variable           | Description      | Default                 | Required |
| ------------------ | ---------------- | ----------------------- | -------- |
| `VITE_API_URL`     | Backend API URL  | `http://localhost:8000` | Yes      |
| `VITE_APP_NAME`    | Application name | `FinVision`             | No       |
| `VITE_APP_VERSION` | App version      | `1.0.0`                 | No       |
| `NODE_ENV`         | Environment      | `development`           | Yes      |

### Backend Environment Variables

| Variable               | Description              | Required |
| ---------------------- | ------------------------ | -------- |
| `SECRET_KEY`           | JWT secret key           | Yes      |
| `POSTGRES_SERVER`      | Database host            | Yes      |
| `POSTGRES_USER`        | Database user            | Yes      |
| `POSTGRES_PASSWORD`    | Database password        | Yes      |
| `POSTGRES_DB`          | Database name            | Yes      |
| `REDIS_URL`            | Redis connection URL     | Yes      |
| `BACKEND_CORS_ORIGINS` | Allowed frontend origins | Yes      |

### Security Considerations

1. **Environment Variables**

   - Never commit `.env` files to version control
   - Use strong, unique secrets for production
   - Rotate secrets regularly

2. **CORS Configuration**

   - Restrict CORS origins to your actual frontend domains
   - Don't use wildcards (`*`) in production

3. **Database Security**
   - Use SSL connections for database
   - Implement proper backup strategies
   - Monitor for suspicious activity

## 🧪 Testing Deployment

### Frontend Testing

```bash
# Test build locally
cd frontend
npm run build
npm run preview

# Test specific environment
VITE_API_URL=https://staging-api.com npm run build
```

### Backend Testing

```bash
# Test production build
cd backend
docker build -f Dockerfile.prod -t test-backend .
docker run -p 8000:8000 test-backend

# Health check
curl http://localhost:8000/health
```

### End-to-End Testing

```bash
# Test complete deployment
curl https://your-netlify-site.netlify.app
curl https://your-backend-api.com/health
```

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**

   ```bash
   # Check Node.js version
   node --version  # Should be 18+

   # Clear cache
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Environment Variable Issues**

   ```bash
   # Frontend: Variables must start with VITE_
   VITE_API_URL=https://api.example.com

   # Check if variables are loaded
   console.log(import.meta.env.VITE_API_URL)
   ```

3. **CORS Errors**

   ```python
   # Backend: Update CORS origins
   BACKEND_CORS_ORIGINS=https://your-site.netlify.app,https://your-custom-domain.com
   ```

4. **Database Connection Issues**

   ```bash
   # Check database URL format
   postgresql://user:password@host:port/database

   # Test connection
   psql $DATABASE_URL
   ```

### Deployment Logs

1. **Netlify Logs**

   - Available in Netlify dashboard → Site overview → Production deploys
   - Use Netlify CLI: `netlify logs`

2. **Backend Logs**
   - Platform-specific (Railway, Render, etc.)
   - Use application logging: `uvicorn main:app --log-level info`

### Performance Optimization

1. **Frontend**

   ```bash
   # Analyze bundle size
   npm run analyze

   # Optimize build
   npm run build:prod
   ```

2. **Backend**

   ```python
   # Use production server
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker

   # Enable compression
   # Add gzip middleware
   ```

## 📊 Monitoring

### Frontend Monitoring

- Netlify Analytics (built-in)
- Google Analytics
- Error tracking: Sentry

### Backend Monitoring

- Health check endpoint: `/health`
- Application Performance Monitoring (APM)
- Database monitoring
- Redis monitoring

## 🔄 CI/CD Pipeline

The project includes GitHub Actions workflows for:

1. **Continuous Integration**

   - Linting and type checking
   - Unit tests
   - Build verification

2. **Continuous Deployment**
   - Automatic deployment to Netlify
   - Environment-specific builds
   - Rollback capabilities

### Workflow Configuration

```yaml
# .github/workflows/netlify-deploy.yml
# Triggers on push to main/dev branches
# Runs tests before deployment
# Deploys to Netlify with proper environment variables
```

## 📝 Deployment Checklist

### Pre-deployment

- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Backend API accessible
- [ ] Domain name configured (if custom)
- [ ] SSL certificates in place

### Post-deployment

- [ ] Health checks passing
- [ ] Frontend loads correctly
- [ ] API endpoints working
- [ ] Authentication flow working
- [ ] File upload functionality working
- [ ] Performance is acceptable

### Production Readiness

- [ ] Error monitoring configured
- [ ] Backup strategy implemented
- [ ] Security headers configured
- [ ] CORS properly restricted
- [ ] Rate limiting implemented
- [ ] Documentation updated

## 🆘 Support

If you encounter issues during deployment:

1. Check the troubleshooting section above
2. Review deployment logs
3. Verify environment variables
4. Test locally with production settings
5. Open an issue in the repository

## 📚 Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Railway Deployment](https://railway.app/docs)
- [Render Deployment](https://render.com/docs)
