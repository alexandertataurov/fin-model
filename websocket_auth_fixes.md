# WebSocket Authentication Fixes

## Issues Identified
1. **WebSocket endpoints lacked authentication**: The `/ws/notifications` endpoint was accepting connections without validating user tokens
2. **Token storage inconsistency**: Frontend used multiple token keys (`auth_token`, `access_token`, `token`) causing confusion
3. **Missing authentication in WebSocket connections**: Frontend wasn't sending auth tokens when establishing WebSocket connections
4. **HTTP 401 errors**: API calls were failing due to token lookup inconsistencies

## Fixes Applied

### 1. Backend WebSocket Authentication (`websocket.py`)
- Added `authenticate_websocket()` function to validate tokens during WebSocket handshake
- Updated `/ws/notifications` endpoint to accept `token` query parameter
- Added proper error handling with WebSocket close codes (4001 for auth errors)
- Integrated with existing `AuthService` and token verification

### 2. Frontend WebSocket Token Passing (`websocket.ts`)
- Modified `connect()` method to retrieve `access_token` from localStorage
- Added token as query parameter in WebSocket URL: `wss://host/ws/notifications?token=...`
- Maintained backward compatibility for reconnection attempts

### 3. Consistent Token Storage (`AuthContext.tsx`)
- Changed `TOKEN_KEY` from `'auth_token'` to `'access_token'` for consistency
- Now all components (API calls, WebSocket, Auth) use the same token key
- Refresh token logic updated to use consistent storage

### 4. Simplified API Utils (`apiUtils.ts`)
- Removed multiple token key lookups
- Now only looks for `access_token` in localStorage
- Cleaner and more predictable token handling

## Security Improvements
- WebSocket connections now require valid JWT tokens
- User authentication is validated on every WebSocket connection
- Invalid tokens result in connection termination with proper error codes
- Database session management for user lookups during WebSocket auth

## Testing
- Created `test_websocket_auth.py` script to verify authentication works
- Tests both authenticated and unauthenticated connection attempts
- Validates proper error handling and message exchange

## Expected Results
1. WebSocket connections to `/ws/notifications` should now authenticate properly
2. HTTP 401 errors should be resolved for authenticated users  
3. Token consistency across all frontend components
4. Better security posture for real-time features

## Usage Notes
- Users must be logged in (have valid `access_token` in localStorage) to use WebSocket features
- WebSocket connections automatically include authentication token
- Invalid or expired tokens will cause WebSocket connections to fail with code 4001
- Frontend should handle WebSocket authentication errors gracefully