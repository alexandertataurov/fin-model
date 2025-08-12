# Pages Functional Improvement & Consistency PRD

## Executive Summary

This PRD outlines the comprehensive plan to remove all mock data from frontend pages and implement full backend functionality integration. The goal is to create a consistent, production-ready user experience across all dashboard pages with real-time data from the backend services.

## Current State Analysis

### Pages Overview

| Page                      | Status             | Mock Data Issues       | Backend Integration               |
| ------------------------- | ------------------ | ---------------------- | --------------------------------- |
| **Dashboard.tsx**         | ✅ Complete        | No mock data           | Navigation hub only               |
| **NewDashboard.tsx**      | ✅ Complete        | No mock data           | Uses DashboardLayout              |
| **Analytics.tsx**         | ✅ Complete        | No mock data           | Uses AnalyticsDashboard component |
| **CashFlowDashboard.tsx** | ❌ Heavy Mock Data | Extensive sample data  | Partial backend integration       |
| **PLDashboard.tsx**       | ❌ Heavy Mock Data | Sample charts/data     | Partial backend integration       |
| **FileUpload.tsx**        | ✅ Complete        | No mock data           | Full backend integration          |
| **Reports.tsx**           | ✅ Complete        | No mock data           | Full backend integration          |
| **ScenarioModeling.tsx**  | ✅ Complete        | No mock data           | Full backend integration          |
| **Login.tsx**             | ✅ Complete        | Demo placeholders only | Full backend integration          |
| **Register.tsx**          | ✅ Complete        | No mock data           | Full backend integration          |

### Identified Mock Data Issues

#### CashFlowDashboard.tsx

```typescript
// ISSUES TO REMOVE:
const sampleWaterfallData: WaterfallDataPoint[] = [
  { name: 'Starting Cash', value: 100000, type: 'start' },
  { name: 'Operating CF', value: 25000, type: 'positive' },
  // ... more sample data
];

// Random mock metrics
${(Math.random() * 100000).toFixed(0)}
"Sample Metric {i}"

// Demo notices
"📊 This is a live demo of the Cash Flow Dashboard. Charts show sample data to demonstrate functionality."
```

#### PLDashboard.tsx

- Similar mock data patterns as CashFlowDashboard
- Sample chart data generation
- Hardcoded metric values

## Implementation Plan

### Phase 1: Backend API Integration (Week 1-2)

#### 1.1 CashFlowDashboard.tsx - Complete Backend Integration

**Current Mock Data to Remove:**

- `sampleWaterfallData` hardcoded values
- Random metric generation with `Math.random()`
- Sample metric placeholders
- Demo notices and fallback data

**Backend Endpoints to Integrate:**

- `GET /api/v1/dashboard/metrics/cash-flow` - Cash flow metrics
- `GET /api/v1/dashboard/overview` - Dashboard overview data
- `GET /api/v1/statements` - Financial statements list

**Implementation Tasks:**

```typescript
// Replace mock waterfall data with real API call
const { data: waterfallData } = useQuery({
  queryKey: ['cash-waterfall', period, fileId],
  queryFn: async () => {
    const response = await fetch(
      `/api/v1/dashboard/metrics/cash-flow?period=${period}&file_id=${fileId}`
    );
    return response.json();
  },
});

// Replace random metrics with real data
const { data: cashFlowMetrics } = useQuery({
  queryKey: ['cash-flow-metrics', period],
  queryFn: async () => {
    const response = await fetch(
      `/api/v1/dashboard/metrics/overview?period=${period}`
    );
    return response.json();
  },
});
```

#### 1.2 PLDashboard.tsx - Complete Backend Integration

**Backend Endpoints to Integrate:**

- `GET /api/v1/dashboard/metrics/pl` - P&L specific metrics
- `GET /api/v1/dashboard/metrics/ratios` - Financial ratios
- `GET /api/v1/dashboard/metrics/variance` - Variance analysis

**Implementation Tasks:**

```typescript
// Replace mock P&L data with real API calls
const { data: plData } = useQuery({
  queryKey: ['pl-dashboard', period, fileId],
  queryFn: async () => {
    const response = await fetch(
      `/api/v1/dashboard/metrics/pl?period=${period}&file_id=${fileId}`
    );
    return response.json();
  },
});

// Integrate real chart data
const { data: chartData } = useQuery({
  queryKey: ['pl-charts', period],
  queryFn: async () => {
    const response = await fetch(`/api/v1/dashboard/pl/${statementId}`);
    return response.json();
  },
});
```

### Phase 2: Data Flow Standardization (Week 2-3)

#### 2.1 Unified Data Types

Create consistent TypeScript interfaces across all dashboard pages:

```typescript
// types/dashboard.ts
export interface DashboardMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  format_type: 'currency' | 'percentage' | 'number';
  change?: number;
  change_percentage?: number;
  trend?: 'up' | 'down' | 'stable';
  period: string;
  last_updated: string;
}

export interface ChartDataPoint {
  period: string;
  value: number;
  date: string;
  label?: string;
  category?: string;
}

export interface DashboardData {
  metrics: DashboardMetric[];
  charts: {
    [key: string]: ChartDataPoint[];
  };
  period_info: {
    period: string;
    start_date: string;
    end_date: string;
  };
  last_updated: string;
  data_quality_score: number;
}
```

#### 2.2 Unified API Service Layer

Create centralized API services for consistent data fetching:

```typescript
// services/dashboardApi.ts
export class DashboardApiService {
  static async getOverviewMetrics(
    period: string,
    fileId?: number
  ): Promise<DashboardData> {
    const params = new URLSearchParams({ period });
    if (fileId) params.append('file_id', fileId.toString());

    const response = await fetch(
      `/api/v1/dashboard/metrics/overview?${params}`
    );
    if (!response.ok) throw new Error('Failed to fetch overview metrics');
    return response.json();
  }

  static async getCashFlowMetrics(
    period: string,
    fileId?: number
  ): Promise<DashboardData> {
    const params = new URLSearchParams({ period });
    if (fileId) params.append('file_id', fileId.toString());

    const response = await fetch(
      `/api/v1/dashboard/metrics/cash-flow?${params}`
    );
    if (!response.ok) throw new Error('Failed to fetch cash flow metrics');
    return response.json();
  }

  static async getPLMetrics(
    period: string,
    fileId?: number
  ): Promise<DashboardData> {
    const params = new URLSearchParams({ period });
    if (fileId) params.append('file_id', fileId.toString());

    const response = await fetch(`/api/v1/dashboard/metrics/pl?${params}`);
    if (!response.ok) throw new Error('Failed to fetch P&L metrics');
    return response.json();
  }
}
```

### Phase 3: Error Handling & Loading States (Week 3-4)

#### 3.1 Consistent Loading States

Replace demo notices with proper loading states:

```typescript
// Before (CashFlowDashboard.tsx)
<Alert severity="info" sx={{ mb: 3 }}>
  📊 This is a live demo of the Cash Flow Dashboard. Charts show sample data to demonstrate functionality.
</Alert>

// After
{isLoading && (
  <Box display="flex" justifyContent="center" p={4}>
    <CircularProgress />
  </Box>
)}

{error && (
  <Alert severity="error" sx={{ mb: 3 }}>
    Failed to load cash flow data. Please try refreshing or contact support.
  </Alert>
)}
```

#### 3.2 Graceful Error Handling

Implement consistent error boundaries and fallback states:

```typescript
// hooks/useDashboardData.ts
export const useDashboardData = (
  type: 'pl' | 'cashflow' | 'overview',
  period: string,
  fileId?: number
) => {
  return useQuery({
    queryKey: [type, period, fileId],
    queryFn: () => DashboardApiService.getMetrics(type, period, fileId),
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    onError: error => {
      console.error(`Failed to fetch ${type} dashboard data:`, error);
      // Could integrate with error reporting service
    },
  });
};
```

### Phase 4: Performance Optimization (Week 4-5)

#### 4.1 Data Caching Strategy

Implement intelligent caching for dashboard data:

```typescript
// services/cacheManager.ts
export class DashboardCacheManager {
  private static CACHE_KEYS = {
    OVERVIEW: 'dashboard:overview',
    PL: 'dashboard:pl',
    CASHFLOW: 'dashboard:cashflow',
  };

  static getCacheKey(type: string, period: string, fileId?: number): string {
    return `${this.CACHE_KEYS[type.toUpperCase()]}:${period}:${fileId || 'all'}`;
  }

  static invalidateCache(type?: string) {
    const queryClient = useQueryClient();
    if (type) {
      queryClient.invalidateQueries([type]);
    } else {
      queryClient.invalidateQueries(['dashboard']);
    }
  }
}
```

#### 4.2 Chart Data Optimization

Optimize chart data loading and rendering:

```typescript
// components/OptimizedChart.tsx
export const OptimizedChart: React.FC<ChartProps> = ({ data, type, ...props }) => {
  const memoizedData = useMemo(() => {
    // Process and optimize chart data
    return data?.length > 100 ? sampleData(data, 100) : data;
  }, [data]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    interaction: { intersect: false },
    plugins: { legend: { display: true } }
  }), []);

  return (
    <Chart
      data={memoizedData}
      options={chartOptions}
      type={type}
      {...props}
    />
  );
};
```

### Phase 5: Testing & Quality Assurance (Week 5-6)

#### 5.1 Unit Tests for API Integration

```typescript
// __tests__/dashboardApi.test.ts
describe('DashboardApiService', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should fetch overview metrics successfully', async () => {
    const mockData = { metrics: [], charts: {} };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const result = await DashboardApiService.getOverviewMetrics('ytd');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/dashboard/metrics/overview?period=ytd'
    );
    expect(result).toEqual(mockData);
  });

  it('should handle API errors gracefully', async () => {
    fetchMock.mockRejectOnce(new Error('Network error'));

    await expect(DashboardApiService.getOverviewMetrics('ytd')).rejects.toThrow(
      'Failed to fetch overview metrics'
    );
  });
});
```

#### 5.2 Integration Tests

```typescript
// __tests__/dashboards.integration.test.tsx
describe('Dashboard Integration', () => {
  it('should load real data in CashFlowDashboard', async () => {
    render(<CashFlowDashboard />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Verify real data is displayed (no mock indicators)
    expect(screen.queryByText(/demo/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sample/i)).not.toBeInTheDocument();
    expect(screen.getByTestId('cash-flow-metrics')).toBeInTheDocument();
  });
});
```

## Success Criteria

### Functional Requirements

1. **Zero Mock Data**: No hardcoded sample data in any dashboard page
2. **Real-time Data**: All metrics and charts display actual data from backend
3. **Consistent APIs**: All pages use standardized API service layer
4. **Error Handling**: Graceful handling of API failures with user-friendly messages
5. **Performance**: Dashboard load times under 3 seconds
6. **Data Quality**: Display data quality scores and confidence indicators

### Technical Requirements

1. **Type Safety**: 100% TypeScript coverage for API interfaces
2. **Caching**: Intelligent data caching with appropriate TTL
3. **Testing**: 90%+ test coverage for API integration code
4. **Accessibility**: WCAG 2.1 AA compliance maintained
5. **Mobile**: Responsive design preserved across all screen sizes

### User Experience Requirements

1. **Loading States**: Clear loading indicators during data fetch
2. **Empty States**: Meaningful empty states when no data available
3. **Error Recovery**: Clear error messages with actionable next steps
4. **Data Freshness**: Visible timestamps and refresh capabilities
5. **Consistency**: Uniform UI patterns across all dashboard pages

## Implementation Timeline

| Week | Phase                           | Deliverables                              |
| ---- | ------------------------------- | ----------------------------------------- |
| 1    | Backend Integration Setup       | API service layer, TypeScript interfaces  |
| 2    | CashFlowDashboard & PLDashboard | Remove all mock data, integrate real APIs |
| 3    | Error Handling & Loading States | Consistent error boundaries, loading UI   |
| 4    | Performance Optimization        | Caching, chart optimization               |
| 5    | Testing & QA                    | Unit tests, integration tests             |
| 6    | Documentation & Deployment      | Code documentation, deployment guide      |

## Risk Mitigation

1. **Backend Dependency**: Ensure backend APIs are stable before frontend integration
2. **Data Availability**: Implement graceful fallbacks for missing data scenarios
3. **Performance Impact**: Monitor and optimize API call frequency
4. **User Experience**: Maintain smooth transitions during loading states

## Post-Implementation Monitoring

1. **API Performance**: Monitor response times and error rates
2. **User Engagement**: Track dashboard usage patterns
3. **Error Rates**: Monitor and alert on API integration failures
4. **Data Quality**: Track and improve data accuracy scores

## Conclusion

This comprehensive plan will transform the frontend pages from demo-ready mockups to production-ready dashboards with full backend integration. The phased approach ensures minimal disruption while delivering a consistent, high-quality user experience across all financial dashboard pages.
