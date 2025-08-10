# WebSocket 403 Error Fix - Deployment Guide

## Problem
WebSocket connections to `/notifications` were returning 403 Forbidden errors due to authentication middleware being applied to WebSocket endpoints.

## Solution
Mounted WebSocket routes directly to the main FastAPI app, bypassing the API router that has authentication middleware.

## Changes Made

### 1. Updated main.py
- Added WebSocket router import at the top
- Mounted WebSocket router directly with `/ws` prefix
- This bypasses authentication middleware

### 2. Updated api.py
- Removed WebSocket router from API router
- This prevents authentication middleware from being applied

### 3. Updated websocket.py
- Added proper WebSocket state handling
- Improved error handling for connection failures

## New WebSocket URLs

After deployment, WebSocket connections should use:
- **Notifications**: `wss://fin-model-production.up.railway.app/ws/notifications`
- **Collaboration**: `wss://fin-model-production.up.railway.app/ws/collaboration/ws/template/{template_id}`
- **Dashboard**: `wss://fin-model-production.up.railway.app/ws/dashboard/{file_id}`

## Deployment Steps

1. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Fix WebSocket 403 errors - bypass authentication middleware"
   git push
   ```

2. **Update frontend WebSocket URLs** (if needed):
   - Change from `/api/v1/websocket/notifications` to `/ws/notifications`
   - Update any hardcoded WebSocket URLs in the frontend

3. **Monitor deployment:**
   - Check Railway logs for any startup errors
   - Test WebSocket connections after deployment

## Expected Results

- ✅ WebSocket connections should no longer return 403 errors
- ✅ Health check endpoint should work properly
- ✅ Service should start without import errors

## Testing

After deployment, test WebSocket connections:
```javascript
// Test notifications WebSocket
const ws = new WebSocket('wss://fin-model-production.up.railway.app/ws/notifications');
ws.onopen = () => console.log('Connected!');
ws.onmessage = (event) => console.log('Message:', event.data);
```

## Rollback Plan

If issues occur, you can:
1. Revert the main.py changes
2. Move WebSocket router back to api.py
3. Add authentication bypass logic to WebSocket endpoints
