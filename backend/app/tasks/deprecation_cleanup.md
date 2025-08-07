# Deprecated Functionality Cleanup Tasks

## Overview
This document identifies deprecated functionality, duplicate code, and outdated patterns that should be removed to improve code quality and maintainability.

---

## 🔍 Identified Deprecated Items

### 1. Frontend API Configuration Duplication
**Location**: `frontend/src/services/`

#### Issues Found:
- **Duplicate Axios Instances**: Both `api.ts` and `authApi.ts` create separate axios instances
- **Different Token Storage**: Mixed usage of `'token'` vs `'auth_token'` keys
- **Inconsistent Base URLs**: Both hardcode Railway URL instead of using environment variables
- **Different Error Handling**: Inconsistent 401 handling patterns

#### Files to Update:
```
frontend/src/services/api.ts - Lines 1-42
frontend/src/services/authApi.ts - Lines 1-60
```

#### Cleanup Tasks:
- [ ] Consolidate to single axios instance in `api.ts`
- [ ] Standardize token storage key to `'auth_token'`
- [ ] Move base URL to environment variable
- [ ] Implement consistent error handling
- [ ] Update all service files to use shared instance
- [ ] Remove duplicate interceptor logic

---

### 2. Authentication Token Handling Inconsistency
**Location**: Multiple files

#### Issues Found:
- **Mixed Token Keys**: 
  - `localStorage.getItem('token')` in `api.ts:18`
  - `localStorage.getItem('auth_token')` in `authApi.ts:17`
  - `localStorage.getItem('refresh_token')` in `authApi.ts:34`
- **Inconsistent Cleanup**: Different logout procedures
- **Mixed Token Refresh**: Some files have refresh logic, others don't

#### Cleanup Tasks:
- [ ] Standardize all token keys to consistent naming
- [ ] Implement centralized token management service
- [ ] Create unified logout procedure
- [ ] Implement consistent token refresh across all services
- [ ] Add token expiration handling

---

### 3. Unused Backend Task Patterns
**Location**: `backend/app/tasks/`

#### Issues Found:
- **Duplicate DatabaseTask Classes**: Each task file defines its own `DatabaseTask` base class
- **Inconsistent Error Handling**: Different error handling patterns across tasks
- **Unused Function Wrapping**: `process_uploaded_file.__wrapped__` pattern only needed for tests

#### Files to Update:
```
backend/app/tasks/file_processing.py - Lines 16-25, 393-394
backend/app/tasks/notifications.py - Lines 13-22, 214-216
backend/app/tasks/scheduled_tasks.py - Lines 14-23
```

#### Cleanup Tasks:
- [ ] Create shared `DatabaseTask` base class in common module
- [ ] Standardize error handling patterns
- [ ] Remove unnecessary function wrapping
- [ ] Consolidate common task utilities
- [ ] Implement consistent logging patterns

---

### 4. Hardcoded Configuration Values
**Location**: Multiple files

#### Issues Found:
- **Hardcoded Railway URLs**: `'https://fin-model-production.up.railway.app'`
- **Magic Numbers**: Timeout values, retry counts, etc.
- **Hardcoded Paths**: File paths and directory references
- **Fixed Port Numbers**: `port=8000` in main.py

#### Files to Update:
```
frontend/src/services/api.ts - Line 4
frontend/src/services/authApi.ts - Line 4
main.py - Line 25
```

#### Cleanup Tasks:
- [ ] Move all URLs to environment variables
- [ ] Create configuration constants file
- [ ] Replace magic numbers with named constants
- [ ] Implement dynamic port configuration
- [ ] Add development/production environment handling

---

### 5. Deprecated Database Migration Patterns
**Location**: `backend/alembic/versions/`

#### Issues Found:
- **Duplicate Index Creation**: Multiple migrations creating similar indexes
- **Inconsistent Naming**: Mixed naming conventions for constraints
- **Redundant Migrations**: Some migrations could be consolidated

#### Investigation Required:
- [ ] Audit all migration files for duplicates
- [ ] Identify migrations that can be consolidated
- [ ] Check for unused indexes or constraints
- [ ] Verify migration rollback procedures

---

### 6. Frontend Component Duplication
**Location**: `frontend/src/components/`

#### Potential Issues:
- **Multiple Theme Providers**: 
  - `components/ThemeProvider.tsx`
  - `components/theme-provider.tsx`
  - `components/ui/theme-provider.tsx`
- **Duplicate UI Components**: Similar components in different directories
- **Inconsistent Styling**: Mixed usage of styling approaches

#### Files to Investigate:
```
frontend/src/components/ThemeProvider.tsx
frontend/src/components/theme-provider.tsx
frontend/src/components/ui/theme-provider.tsx
frontend/src/components/layout.tsx
frontend/src/components/sidebar.tsx
frontend/src/design/components/ui/sidebar.tsx
```

#### Cleanup Tasks:
- [ ] Consolidate theme providers to single implementation
- [ ] Remove duplicate UI components
- [ ] Standardize component structure
- [ ] Consolidate styling approaches
- [ ] Update all imports to use canonical components

---

### 7. Unused Dependencies and Imports
**Location**: Various files

#### Investigation Required:
- [ ] Audit package.json for unused dependencies
- [ ] Check for unused import statements
- [ ] Identify deprecated package versions
- [ ] Remove development dependencies from production builds
- [ ] Clean up unused type definitions

---

### 8. Deprecated Environment Configuration
**Location**: Configuration files

#### Issues Found:
- **Mixed Environment Variables**: Inconsistent naming patterns
- **Hardcoded Development Values**: Production values in development configs
- **Missing Environment Validation**: No validation of required variables

#### Cleanup Tasks:
- [ ] Standardize environment variable naming
- [ ] Create environment validation
- [ ] Separate development/production configs
- [ ] Document all environment variables
- [ ] Add default values where appropriate

---

### 9. Legacy API Endpoint Patterns
**Location**: Backend API endpoints

#### Potential Deprecated Patterns:
- **Inconsistent Response Formats**: Mixed success/error response structures
- **Deprecated Status Codes**: Non-standard HTTP status usage
- **Legacy Authentication**: Old authentication middleware
- **Unused Endpoint Parameters**: Parameters no longer used by frontend

#### Investigation Required:
- [ ] Audit all endpoint response formats
- [ ] Standardize HTTP status code usage
- [ ] Remove unused authentication middleware
- [ ] Clean up unused endpoint parameters
- [ ] Update API documentation

---

### 10. Frontend Test Pattern Inconsistencies
**Location**: `frontend/src/test/`

#### Issues Found:
- **Mixed Testing Libraries**: Different test setup patterns
- **Duplicate Test Utilities**: Similar helper functions
- **Inconsistent Mock Patterns**: Different mocking approaches

#### Files to Investigate:
```
frontend/src/test/test-utils.tsx
frontend/src/test/integration/index.test.ts
```

#### Cleanup Tasks:
- [ ] Standardize testing library usage
- [ ] Consolidate test utilities
- [ ] Implement consistent mock patterns
- [ ] Update test configuration
- [ ] Remove deprecated test patterns

---

## 🧹 Cleanup Implementation Plan

### Phase 1: Critical Infrastructure Cleanup (Week 1)
1. **API Configuration Consolidation**
   - Merge axios instances
   - Standardize token handling
   - Implement environment configuration

2. **Authentication System Cleanup**
   - Unify token storage
   - Implement consistent logout
   - Standardize error handling

### Phase 2: Backend Task Consolidation (Week 1)
1. **Database Task Refactoring**
   - Create shared base class
   - Standardize error patterns
   - Remove duplicate code

2. **Configuration Management**
   - Environment variable cleanup
   - Configuration validation
   - Remove hardcoded values

### Phase 3: Frontend Component Cleanup (Week 2)
1. **Component Consolidation**
   - Remove duplicate components
   - Standardize styling
   - Update import statements

2. **Theme Provider Cleanup**
   - Consolidate theme providers
   - Standardize theme structure
   - Update component usage

### Phase 4: Database and API Cleanup (Week 2)
1. **Migration Consolidation**
   - Remove duplicate migrations
   - Consolidate similar changes
   - Update migration patterns

2. **API Standardization**
   - Standardize response formats
   - Clean up unused parameters
   - Update documentation

### Phase 5: Dependency and Test Cleanup (Week 1)
1. **Dependency Audit**
   - Remove unused packages
   - Update deprecated versions
   - Clean up imports

2. **Test Standardization**
   - Consolidate test utilities
   - Standardize mock patterns
   - Update test configuration

---

## 🎯 Success Criteria

### Code Quality Metrics
- [ ] Eliminate all duplicate code patterns
- [ ] Achieve consistent error handling across services
- [ ] Standardize configuration management
- [ ] Remove all hardcoded values
- [ ] Consolidate authentication patterns

### Performance Improvements
- [ ] Reduce bundle size by removing unused dependencies
- [ ] Improve build times by cleaning up imports
- [ ] Optimize database migrations
- [ ] Streamline API response handling

### Maintainability Improvements
- [ ] Single source of truth for common functionality
- [ ] Consistent code patterns across codebase
- [ ] Comprehensive documentation updates
- [ ] Simplified configuration management

### Testing Improvements
- [ ] Consistent testing patterns
- [ ] Improved test coverage
- [ ] Faster test execution
- [ ] Better test maintainability

---

## 🔄 Validation Process

### Automated Checks
- [ ] Linting rules to prevent duplicate patterns
- [ ] Bundle analysis to identify unused code
- [ ] Dependency audit for security vulnerabilities
- [ ] Performance benchmarks before/after cleanup

### Manual Review
- [ ] Code review for consistency
- [ ] Documentation review for accuracy
- [ ] Configuration validation
- [ ] API testing for breaking changes

### Regression Testing
- [ ] Full test suite execution
- [ ] Integration testing
- [ ] User acceptance testing
- [ ] Performance testing

This comprehensive cleanup will improve code maintainability, reduce technical debt, and create a more consistent development experience.