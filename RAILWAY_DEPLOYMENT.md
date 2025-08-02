# Railway Deployment Guide

## Overview

This guide provides specific instructions for deploying the FinVision backend to Railway, including solutions for common database migration issues.

## Quick Deployment Steps

1. **Connect Repository**: Link your GitHub repository to Railway
2. **Set Environment Variables**: Configure the required environment variables
3. **Deploy**: Railway will automatically build and deploy

## Environment Variables

Set these in your Railway project settings:

```bash
# Database (automatically provided by Railway PostgreSQL)
DATABASE_URL=postgresql://postgres:password@postgres.railway.internal:5432/railway

# Authentication
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# File Upload
MAX_FILE_SIZE=50000000
UPLOAD_DIR=uploads

# Migration Control
AUTO_MIGRATE_DATABASE=true
AUTO_FIX_DATABASE=true

# Optional: Redis for caching
REDIS_URL=redis://default:password@redis.railway.internal:6379
```

## Migration Issues and Solutions

### Common Problems

1. **Index Already Exists Errors**
   - Railway retains database state between deployments
   - Solution: Our migrations now include existence checks

2. **Permission Denied on Index Creation**
   - Solution: Use `IF NOT EXISTS` clauses in migrations

3. **Concurrent Index Creation Failures**
   - Solution: Wrap index creation in try-catch blocks

### Auto-Fix System

The application includes an auto-fix system that runs before migrations:

- **Location**: `simple_fix.py`
- **Purpose**: Cleans up problematic indexes and ensures database consistency
- **Control**: Set `AUTO_FIX_DATABASE=false` to disable

### Migration Flow

1. **Auto-Fix** (if enabled): Cleans up conflicting database objects
2. **Alembic Migrations**: Runs all pending migrations
3. **Application Start**: Starts the FastAPI server

### Troubleshooting Migration Failures

#### 1. Index Conflicts

**Symptom**: `relation "ix_rate_limits_key" already exists`

**Solution**: The auto-fix system now handles this automatically. If it persists:

```sql
-- Connect to Railway database and run:
DROP INDEX IF EXISTS ix_rate_limits_key;
DROP INDEX IF EXISTS ix_rate_limits_window_start;
```

#### 2. Table Missing Errors

**Symptom**: `relation "rate_limits" does not exist`

**Solution**: 
- Ensure migration 008 completed successfully
- Check Railway logs for migration errors
- Manually run: `python backend/run_migrations.py`

#### 3. Migration Timeout

**Symptom**: Migration process times out

**Solution**:
- Check Railway resource limits
- Consider breaking large migrations into smaller ones
- Use `CONCURRENTLY` for index creation on large tables

### Manual Migration Recovery

If automatic migrations fail, you can recover manually:

1. **Access Railway Database**:
   ```bash
   # Use Railway CLI or connect via provided DATABASE_URL
   railway connect
   ```

2. **Check Migration Status**:
   ```sql
   SELECT * FROM alembic_version;
   ```

3. **Reset if Needed**:
   ```sql
   -- Only if absolutely necessary
   DELETE FROM alembic_version;
   ```

4. **Re-run Migrations**:
   ```bash
   python backend/run_migrations.py
   ```

### Migration Best Practices for Railway

1. **Test Locally First**: Always test migrations on a local PostgreSQL instance
2. **Backup Database**: Railway provides automatic backups, but verify before major migrations
3. **Monitor Logs**: Watch Railway deployment logs for migration progress
4. **Gradual Rollout**: Deploy migrations during low-traffic periods

## Build Configuration

Railway automatically detects Python applications. No additional build configuration needed.

### Build Process

1. **Install Dependencies**: `pip install -r backend/requirements.txt`
2. **Run Auto-Fix**: `python simple_fix.py` (if enabled)
3. **Run Migrations**: `python backend/run_migrations.py`
4. **Start Application**: `python main.py`

## Health Checks

The application includes health check endpoints:

- **Basic Health**: `GET /health`
- **Database Health**: `GET /health/db`
- **Detailed Status**: `GET /health/detailed`

## Monitoring and Logs

### Railway Logs

Monitor deployment and runtime logs via:
- Railway Dashboard
- Railway CLI: `railway logs`

### Application Logs

Key log patterns to watch for:
- `✅ Database migrations completed!`: Successful migration
- `⚠️ Migration error:`: Migration failure (continues startup)
- `❌ Failed to start application:`: Critical startup failure

### Database Monitoring

Monitor database performance:
```python
from app.services.database_monitor import db_monitor

# Check health
health = db_monitor.get_health_check()

# Monitor performance
performance = db_monitor.get_query_performance()
```

## Scaling Considerations

### Database Connection Pool

Current settings (optimized for Railway):
- **Pool Size**: 20 base connections
- **Max Overflow**: 40 additional connections
- **Pool Timeout**: 30 seconds
- **Pool Recycle**: 1 hour

### Performance Optimization

1. **Indexes**: All critical indexes are created via migrations
2. **Connection Pooling**: Configured for Railway's resource limits
3. **Query Optimization**: Use repository pattern for efficient queries

## Emergency Procedures

### Complete Migration Reset

**⚠️ Use only as last resort - will lose all data**

1. Delete Railway PostgreSQL service
2. Create new PostgreSQL service
3. Update `DATABASE_URL` environment variable
4. Redeploy application

### Rollback Deployment

1. Use Railway's deployment history
2. Or revert to previous Git commit and push
3. Monitor logs for successful rollback

## Environment-Specific Notes

### Development vs Production

- **Development**: Migrations run on every startup
- **Production**: Migrations run via Railway's release phase
- **Local**: Use `python backend/run_migrations.py` manually

### Database Differences

- **Local**: SQLite for development (optional)
- **Railway**: PostgreSQL (recommended)
- **Testing**: In-memory SQLite

## Support and Troubleshooting

### Common Error Messages

1. **"Migration error but continuing"**: Non-critical, application will start
2. **"Failed to start application"**: Critical error, check logs
3. **"Database connection failed"**: Check `DATABASE_URL` and Railway PostgreSQL service

### Getting Help

1. Check Railway deployment logs
2. Review this documentation
3. Check GitHub issues in the repository
4. Verify environment variables are set correctly

### Debug Mode

Enable debug mode for detailed migration logs:

```bash
# Add to Railway environment variables
DEBUG_MIGRATIONS=true
SQLALCHEMY_ECHO=true
```

## Best Practices

1. **Environment Variables**: Always use Railway's environment variable system
2. **Secrets**: Never commit secrets to the repository
3. **Monitoring**: Regularly check application and database health
4. **Backups**: Rely on Railway's automatic backups but verify they're working
5. **Updates**: Test all changes in a staging environment first

This guide should resolve most Railway deployment and migration issues you might encounter.