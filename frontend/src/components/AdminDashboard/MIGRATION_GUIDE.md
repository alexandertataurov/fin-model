# Admin Dashboard Migration Guide

## Overview

This guide helps you migrate from the old atomic design structure to the new feature-based architecture in Phase 3 of the Admin Dashboard cleanup and consolidation plan.

## What Changed

### Old Structure (Atomic Design)

```
AdminDashboard/
├── atoms/
├── molecules/
├── organisms/
├── utils/
├── hooks/
├── types/
└── patterns/
```

### New Structure (Feature-Based)

```
AdminDashboard/
├── features/
│   ├── user-management/
│   ├── system-monitoring/
│   ├── data-management/
│   ├── maintenance-tools/
│   ├── logs/
│   ├── health/
│   ├── dashboard-customization/
│   └── overview/
├── shared/
├── state/
└── legacy/ (backward compatibility)
```

## Migration Steps

### 1. Update Import Statements

#### Before (Old Structure)

```typescript
import { UserTable } from '@/components/AdminDashboard/molecules/UserTable';
import { useUserManagement } from '@/components/AdminDashboard/hooks/useAdminData';
import { UserWithRoles } from '@/components/AdminDashboard/types/interfaces';
```

#### After (New Structure)

```typescript
import {
  UserTable,
  useUserManagement,
  UserWithRoles,
} from '@/components/AdminDashboard/features/user-management';
```

### 2. Use New State Management

#### Before (Component State)

```typescript
const [users, setUsers] = useState<UserWithRoles[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const fetchUsers = async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/users');
    const data = await response.json();
    setUsers(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

#### After (Centralized State)

```typescript
import { useUserManagement } from '@/components/AdminDashboard/features/user-management';

const { users, isLoadingUsers, usersError, fetchUsers } = useUserManagement();
```

### 3. Use Feature-Specific Hooks

#### Before (Generic Hooks)

```typescript
import { useAdminData } from '@/components/AdminDashboard/hooks/useAdminData';

const { users, userAnalytics } = useAdminData();
```

#### After (Feature Hooks)

```typescript
import {
  useUserManagement,
  useUserAnalytics,
} from '@/components/AdminDashboard/features/user-management';

const { users, fetchUsers } = useUserManagement();
const { computedAnalytics, performanceMetrics } = useUserAnalytics();
```

### 4. Update Component Props

#### Before (Manual Props)

```typescript
<UserTable
  users={users}
  onUserUpdate={handleUserUpdate}
  onUserDelete={handleUserDelete}
  isLoading={loading}
  error={error}
/>
```

#### After (Hook Integration)

```typescript
const { users, updateUser, deleteUser, isLoadingUsers, usersError } =
  useUserManagement();

<UserTable
  users={users}
  onUserUpdate={updateUser}
  onUserDelete={deleteUser}
  isLoading={isLoadingUsers}
  error={usersError}
/>;
```

## Feature-Specific Migration

### User Management

#### Old Structure

```typescript
// atoms/UserTableRow.tsx
// molecules/UserTable.tsx
// organisms/UserManagementOrganism.tsx
// hooks/useAdminData.ts (partial)
```

#### New Structure

```typescript
// features/user-management/
├── components/
│   ├── UserTable.tsx
│   ├── UserTableRow.tsx
│   ├── UserAnalyticsCard.tsx
│   └── UserActivityCard.tsx
├── hooks/
│   ├── useUserManagement.ts
│   └── useUserAnalytics.ts
├── types.ts
└── index.ts
```

### System Monitoring

#### Old Structure

```typescript
// atoms/SystemMetricCard.tsx
// molecules/SystemMetricsGrid.tsx
// organisms/SystemMonitoringOrganism.tsx
```

#### New Structure

```typescript
// features/system-monitoring/
├── components/
│   ├── SystemMetricsGrid.tsx
│   ├── SystemMetricCard.tsx
│   ├── SystemAlert.tsx
│   └── AlertsList.tsx
├── hooks/
│   ├── useSystemHealth.ts
│   └── useSystemMetrics.ts
├── types.ts
└── index.ts
```

## Backward Compatibility

The old structure is still available for backward compatibility:

```typescript
// These still work
import { UserTable } from '@/components/AdminDashboard/molecules/UserTable';
import { useAdminData } from '@/components/AdminDashboard/hooks/useAdminData';
```

However, it's recommended to migrate to the new structure for better performance and maintainability.

## Performance Benefits

### 1. Reduced Bundle Size

- Feature-based code splitting
- Lazy loading of feature components
- Tree shaking optimization

### 2. Better State Management

- Centralized state with Zustand
- Optimized re-renders
- Persistent state across sessions

### 3. Improved Developer Experience

- Feature-specific hooks
- Better TypeScript support
- Clearer component organization

## Testing Migration

### 1. Update Test Imports

```typescript
// Before
import { render, screen } from '@testing-library/react';
import { UserTable } from '../molecules/UserTable';

// After
import { render, screen } from '@testing-library/react';
import { UserTable } from '../features/user-management';
```

### 2. Update Test Setup

```typescript
// Before
const mockUsers = [...];

// After
import { useUserManagement } from '../features/user-management';
jest.mock('../features/user-management', () => ({
  useUserManagement: () => ({
    users: mockUsers,
    isLoadingUsers: false,
    usersError: null,
  }),
}));
```

## Common Issues and Solutions

### Issue 1: Import Not Found

**Error**: `Module not found: Can't resolve '@/components/AdminDashboard/features/user-management'`

**Solution**: Ensure the feature index file exists and exports the component:

```typescript
// features/user-management/index.ts
export { default as UserTable } from './components/UserTable';
```

### Issue 2: Hook Not Available

**Error**: `useUserManagement is not a function`

**Solution**: Import from the correct feature:

```typescript
import { useUserManagement } from '@/components/AdminDashboard/features/user-management';
```

### Issue 3: Type Errors

**Error**: `Property 'users' does not exist on type 'AdminDashboardState'`

**Solution**: Update types to match the new state structure:

```typescript
import { UserWithRoles } from '@/components/AdminDashboard/features/user-management';
```

## Migration Checklist

- [ ] Update import statements to use feature-based imports
- [ ] Replace component state with centralized state management
- [ ] Update component props to use hook integration
- [ ] Migrate to feature-specific hooks
- [ ] Update test files with new imports
- [ ] Verify all components render correctly
- [ ] Test performance improvements
- [ ] Update documentation

## Support

If you encounter issues during migration:

1. Check the backward compatibility exports
2. Review the feature-specific documentation
3. Use the legacy structure temporarily
4. Create an issue in the project repository

## Next Steps

After completing the migration:

1. Remove unused legacy components
2. Optimize bundle splitting
3. Add feature-specific tests
4. Update documentation
5. Monitor performance metrics
