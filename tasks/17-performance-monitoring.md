# Task 17: Performance Monitoring & Analytics

## Overview

Implement comprehensive performance monitoring, analytics, and optimization features including Real User Monitoring (RUM), application performance tracking, data quality monitoring, and user engagement analytics as outlined in the PRD requirements.

## Complexity: ⭐⭐ MEDIUM

**Estimated Time: 45-60 hours**

## Prerequisites

- Application deployed and operational
- Dashboard and reporting systems functional
- Authentication and user management complete
- Real-time features implemented (Task 16)

## Task Breakdown

### 17.1 Application Performance Monitoring ⭐⭐

**Estimated Time: 20-25 hours**

#### Scope

Implement comprehensive APM for backend performance, database queries, and API response times

#### Implementation Steps

1. **Backend Performance Monitoring** (8-10 hours)

   ```python
   # core/monitoring.py
   import time
   import psutil
   from datetime import datetime, timedelta
   from typing import Dict, List, Optional
   from dataclasses import dataclass
   from prometheus_client import Counter, Histogram, Gauge, start_http_server
   import logging

   # Prometheus metrics
   request_count = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint', 'status_code'])
   request_duration = Histogram('http_request_duration_seconds', 'HTTP request duration', ['method', 'endpoint'])
   active_connections = Gauge('active_websocket_connections', 'Active WebSocket connections')
   database_query_duration = Histogram('database_query_duration_seconds', 'Database query duration', ['query_type'])
   memory_usage = Gauge('memory_usage_bytes', 'Memory usage in bytes')
   cpu_usage = Gauge('cpu_usage_percent', 'CPU usage percentage')

   @dataclass
   class PerformanceMetric:
       timestamp: datetime
       metric_type: str
       value: float
       tags: Dict[str, str]
       context: Optional[Dict] = None

   class PerformanceMonitor:
       def __init__(self):
           self.metrics_buffer: List[PerformanceMetric] = []
           self.alert_thresholds = {
               'response_time': 3.0,  # seconds
               'error_rate': 0.05,    # 5%
               'memory_usage': 0.85,  # 85%
               'cpu_usage': 0.80      # 80%
           }

       def record_request(self, method: str, endpoint: str, duration: float, status_code: int):
           """Record HTTP request metrics"""
           request_count.labels(method=method, endpoint=endpoint, status_code=status_code).inc()
           request_duration.labels(method=method, endpoint=endpoint).observe(duration)

           # Store detailed metric
           metric = PerformanceMetric(
               timestamp=datetime.utcnow(),
               metric_type='http_request',
               value=duration,
               tags={
                   'method': method,
                   'endpoint': endpoint,
                   'status_code': str(status_code)
               }
           )
           self.metrics_buffer.append(metric)

           # Check for performance alerts
           if duration > self.alert_thresholds['response_time']:
               self.trigger_alert('slow_request', {
                   'endpoint': endpoint,
                   'duration': duration,
                   'threshold': self.alert_thresholds['response_time']
               })

       def record_database_query(self, query_type: str, duration: float, query: str = None):
           """Record database query performance"""
           database_query_duration.labels(query_type=query_type).observe(duration)

           metric = PerformanceMetric(
               timestamp=datetime.utcnow(),
               metric_type='database_query',
               value=duration,
               tags={'query_type': query_type},
               context={'query': query[:200] if query else None}  # Truncate long queries
           )
           self.metrics_buffer.append(metric)

       def update_system_metrics(self):
           """Update system resource metrics"""
           # Memory usage
           memory = psutil.virtual_memory()
           memory_usage.set(memory.used)

           # CPU usage
           cpu_percent = psutil.cpu_percent(interval=1)
           cpu_usage.set(cpu_percent)

           # Check thresholds
           if memory.percent / 100 > self.alert_thresholds['memory_usage']:
               self.trigger_alert('high_memory_usage', {
                   'current': memory.percent,
                   'threshold': self.alert_thresholds['memory_usage'] * 100
               })

           if cpu_percent / 100 > self.alert_thresholds['cpu_usage']:
               self.trigger_alert('high_cpu_usage', {
                   'current': cpu_percent,
                   'threshold': self.alert_thresholds['cpu_usage'] * 100
               })

       def trigger_alert(self, alert_type: str, context: Dict):
           """Trigger performance alert"""
           logging.warning(f"Performance alert: {alert_type}", extra=context)
           # Here you could integrate with alerting services like PagerDuty, Slack, etc.

   # Create global monitor instance
   performance_monitor = PerformanceMonitor()
   ```

2. **Request Middleware for Monitoring** (4-5 hours)

   ```python
   # middleware/monitoring_middleware.py
   import time
   from fastapi import Request, Response
   from starlette.middleware.base import BaseHTTPMiddleware
   from core.monitoring import performance_monitor

   class MonitoringMiddleware(BaseHTTPMiddleware):
       async def dispatch(self, request: Request, call_next):
           start_time = time.time()

           # Extract endpoint info
           method = request.method
           endpoint = str(request.url.path)

           try:
               response = await call_next(request)

               # Record successful request
               duration = time.time() - start_time
               performance_monitor.record_request(
                   method=method,
                   endpoint=endpoint,
                   duration=duration,
                   status_code=response.status_code
               )

               # Add performance headers
               response.headers["X-Response-Time"] = f"{duration:.3f}s"

               return response

           except Exception as e:
               # Record failed request
               duration = time.time() - start_time
               performance_monitor.record_request(
                   method=method,
                   endpoint=endpoint,
                   duration=duration,
                   status_code=500
               )
               raise

   # Database query monitoring decorator
   def monitor_db_query(query_type: str):
       def decorator(func):
           async def wrapper(*args, **kwargs):
               start_time = time.time()
               try:
                   result = await func(*args, **kwargs)
                   duration = time.time() - start_time
                   performance_monitor.record_database_query(query_type, duration)
                   return result
               except Exception as e:
                   duration = time.time() - start_time
                   performance_monitor.record_database_query(f"{query_type}_error", duration)
                   raise
           return wrapper
       return decorator
   ```

3. **Performance API Endpoints** (4-5 hours)

   ```python
   # api/v1/endpoints/monitoring.py
   from fastapi import APIRouter, Depends, Query
   from datetime import datetime, timedelta
   from typing import List, Optional
   from core.monitoring import performance_monitor
   from core.dependencies import require_permissions
   from models.user import Permission

   router = APIRouter(prefix="/monitoring", tags=["monitoring"])

   @router.get("/performance/overview")
   async def get_performance_overview(
       hours: int = Query(24, ge=1, le=168),  # Last 24 hours by default, max 1 week
       current_user = Depends(require_permissions(Permission.ADMIN_READ))
   ):
       """Get performance overview for admin dashboard"""

       end_time = datetime.utcnow()
       start_time = end_time - timedelta(hours=hours)

       # Calculate metrics from buffer (in production, use a time-series database)
       metrics = [m for m in performance_monitor.metrics_buffer
                 if start_time <= m.timestamp <= end_time]

       # Calculate response time statistics
       response_times = [m.value for m in metrics if m.metric_type == 'http_request']
       avg_response_time = sum(response_times) / len(response_times) if response_times else 0

       # Calculate error rate
       total_requests = len(response_times)
       error_requests = len([m for m in metrics
                           if m.metric_type == 'http_request' and m.tags.get('status_code', '').startswith('5')])
       error_rate = error_requests / total_requests if total_requests > 0 else 0

       # Database query performance
       db_queries = [m for m in metrics if m.metric_type == 'database_query']
       avg_db_time = sum(m.value for m in db_queries) / len(db_queries) if db_queries else 0

       return {
           "time_range": {
               "start": start_time.isoformat(),
               "end": end_time.isoformat(),
               "hours": hours
           },
           "response_time": {
               "average": avg_response_time,
               "p95": calculate_percentile(response_times, 0.95),
               "p99": calculate_percentile(response_times, 0.99)
           },
           "error_rate": error_rate,
           "request_count": total_requests,
           "database_performance": {
               "average_query_time": avg_db_time,
               "total_queries": len(db_queries)
           },
           "system_resources": {
               "memory_usage": psutil.virtual_memory().percent,
               "cpu_usage": psutil.cpu_percent()
           }
       }

   @router.get("/performance/endpoints")
   async def get_endpoint_performance(
       current_user = Depends(require_permissions(Permission.ADMIN_READ))
   ):
       """Get performance metrics by endpoint"""

       # Group metrics by endpoint
       endpoint_metrics = {}
       for metric in performance_monitor.metrics_buffer:
           if metric.metric_type == 'http_request':
               endpoint = metric.tags.get('endpoint', 'unknown')
               if endpoint not in endpoint_metrics:
                   endpoint_metrics[endpoint] = []
               endpoint_metrics[endpoint].append(metric)

       # Calculate statistics for each endpoint
       results = []
       for endpoint, metrics in endpoint_metrics.items():
           response_times = [m.value for m in metrics]
           error_count = len([m for m in metrics if m.tags.get('status_code', '').startswith('5')])

           results.append({
               "endpoint": endpoint,
               "request_count": len(metrics),
               "average_response_time": sum(response_times) / len(response_times),
               "error_count": error_count,
               "error_rate": error_count / len(metrics),
               "slowest_request": max(response_times) if response_times else 0
           })

       return sorted(results, key=lambda x: x['average_response_time'], reverse=True)

   def calculate_percentile(values: List[float], percentile: float) -> float:
       """Calculate percentile from list of values"""
       if not values:
           return 0
       sorted_values = sorted(values)
       index = int(percentile * len(sorted_values))
       return sorted_values[min(index, len(sorted_values) - 1)]
   ```

4. **System Resource Monitoring** (4-5 hours)

   ```python
   # services/system_monitor.py
   import asyncio
   import psutil
   import logging
   from datetime import datetime
   from typing import Dict, Any

   class SystemMonitor:
       def __init__(self, monitoring_interval: int = 30):
           self.monitoring_interval = monitoring_interval
           self.is_monitoring = False

       async def start_monitoring(self):
           """Start continuous system monitoring"""
           self.is_monitoring = True
           while self.is_monitoring:
               try:
                   await self.collect_system_metrics()
                   await asyncio.sleep(self.monitoring_interval)
               except Exception as e:
                   logging.error(f"Error in system monitoring: {e}")
                   await asyncio.sleep(self.monitoring_interval)

       async def collect_system_metrics(self):
           """Collect comprehensive system metrics"""

           # CPU metrics
           cpu_percent = psutil.cpu_percent(interval=1)
           cpu_count = psutil.cpu_count()

           # Memory metrics
           memory = psutil.virtual_memory()
           swap = psutil.swap_memory()

           # Disk metrics
           disk = psutil.disk_usage('/')

           # Network metrics
           network = psutil.net_io_counters()

           # Process metrics
           process = psutil.Process()
           process_memory = process.memory_info()

           metrics = {
               "timestamp": datetime.utcnow().isoformat(),
               "cpu": {
                   "percent": cpu_percent,
                   "count": cpu_count
               },
               "memory": {
                   "total": memory.total,
                   "available": memory.available,
                   "percent": memory.percent,
                   "used": memory.used,
                   "free": memory.free
               },
               "swap": {
                   "total": swap.total,
                   "used": swap.used,
                   "percent": swap.percent
               },
               "disk": {
                   "total": disk.total,
                   "used": disk.used,
                   "free": disk.free,
                   "percent": (disk.used / disk.total) * 100
               },
               "network": {
                   "bytes_sent": network.bytes_sent,
                   "bytes_recv": network.bytes_recv,
                   "packets_sent": network.packets_sent,
                   "packets_recv": network.packets_recv
               },
               "process": {
                   "memory_rss": process_memory.rss,
                   "memory_vms": process_memory.vms,
                   "cpu_percent": process.cpu_percent()
               }
           }

           # Update Prometheus metrics
           performance_monitor.update_system_metrics()

           # Store or send metrics (implement based on your monitoring solution)
           await self.store_metrics(metrics)

       async def store_metrics(self, metrics: Dict[str, Any]):
           """Store metrics in database or send to monitoring service"""
           # Implementation depends on your monitoring solution
           # Could be Prometheus, DataDog, New Relic, etc.
           pass

       def stop_monitoring(self):
           """Stop system monitoring"""
           self.is_monitoring = False

   # Create global system monitor
   system_monitor = SystemMonitor()
   ```

#### Acceptance Criteria

- [ ] Prometheus metrics collection for all endpoints
- [ ] Database query performance monitoring
- [ ] System resource tracking (CPU, memory, disk)
- [ ] Performance alert system for thresholds
- [ ] Admin dashboard for performance overview
- [ ] Endpoint-specific performance analytics

---

### 17.2 Real User Monitoring (RUM) ⭐⭐⭐

**Estimated Time: 15-20 hours**

#### Scope

Implement client-side performance monitoring and user experience analytics

#### Implementation Steps

1. **Frontend Performance Monitoring** (8-10 hours)

   ```typescript
   // services/rum.ts
   interface PerformanceMetric {
     name: string;
     value: number;
     rating: "good" | "needs-improvement" | "poor";
     timestamp: number;
     url: string;
     userId?: string;
   }

   interface UserSession {
     sessionId: string;
     userId?: string;
     startTime: number;
     pageViews: PageView[];
     interactions: UserInteraction[];
     errors: ClientError[];
   }

   class RealUserMonitoring {
     private sessionId: string;
     private userId?: string;
     private startTime: number;
     private metrics: PerformanceMetric[] = [];
     private pageViews: PageView[] = [];
     private interactions: UserInteraction[] = [];
     private sendQueue: any[] = [];

     constructor() {
       this.sessionId = this.generateSessionId();
       this.startTime = Date.now();
       this.setupPerformanceObserver();
       this.setupEventListeners();
       this.startPeriodicReporting();
     }

     private setupPerformanceObserver() {
       // Core Web Vitals monitoring
       if ("PerformanceObserver" in window) {
         // Largest Contentful Paint (LCP)
         new PerformanceObserver((list) => {
           for (const entry of list.getEntries()) {
             this.recordMetric({
               name: "LCP",
               value: entry.startTime,
               rating: this.getLCPRating(entry.startTime),
               timestamp: Date.now(),
               url: window.location.href,
             });
           }
         }).observe({ entryTypes: ["largest-contentful-paint"] });

         // First Input Delay (FID)
         new PerformanceObserver((list) => {
           for (const entry of list.getEntries()) {
             this.recordMetric({
               name: "FID",
               value: entry.processingStart - entry.startTime,
               rating: this.getFIDRating(
                 entry.processingStart - entry.startTime
               ),
               timestamp: Date.now(),
               url: window.location.href,
             });
           }
         }).observe({ entryTypes: ["first-input"] });

         // Cumulative Layout Shift (CLS)
         let clsValue = 0;
         new PerformanceObserver((list) => {
           for (const entry of list.getEntries()) {
             if (!entry.hadRecentInput) {
               clsValue += entry.value;
             }
           }
           this.recordMetric({
             name: "CLS",
             value: clsValue,
             rating: this.getCLSRating(clsValue),
             timestamp: Date.now(),
             url: window.location.href,
           });
         }).observe({ entryTypes: ["layout-shift"] });

         // Long Tasks
         new PerformanceObserver((list) => {
           for (const entry of list.getEntries()) {
             this.recordMetric({
               name: "Long Task",
               value: entry.duration,
               rating: entry.duration > 100 ? "poor" : "good",
               timestamp: Date.now(),
               url: window.location.href,
             });
           }
         }).observe({ entryTypes: ["longtask"] });
       }

       // Navigation timing
       window.addEventListener("load", () => {
         setTimeout(() => {
           const navTiming = performance.getEntriesByType(
             "navigation"
           )[0] as PerformanceNavigationTiming;

           this.recordMetric({
             name: "TTFB",
             value: navTiming.responseStart - navTiming.requestStart,
             rating: this.getTTFBRating(
               navTiming.responseStart - navTiming.requestStart
             ),
             timestamp: Date.now(),
             url: window.location.href,
           });

           this.recordMetric({
             name: "DOM Load",
             value:
               navTiming.domContentLoadedEventEnd -
               navTiming.domContentLoadedEventStart,
             rating: "good", // Simple binary rating for DOM load
             timestamp: Date.now(),
             url: window.location.href,
           });
         }, 0);
       });
     }

     private setupEventListeners() {
       // Page visibility changes
       document.addEventListener("visibilitychange", () => {
         if (document.visibilityState === "hidden") {
           this.sendQueuedMetrics();
         }
       });

       // Route changes (for SPA)
       window.addEventListener("popstate", () => {
         this.recordPageView();
       });

       // Error tracking
       window.addEventListener("error", (event) => {
         this.recordError({
           type: "javascript",
           message: event.message,
           filename: event.filename,
           line: event.lineno,
           column: event.colno,
           stack: event.error?.stack,
           timestamp: Date.now(),
         });
       });

       // Unhandled promise rejections
       window.addEventListener("unhandledrejection", (event) => {
         this.recordError({
           type: "promise_rejection",
           message: event.reason?.message || "Unhandled promise rejection",
           stack: event.reason?.stack,
           timestamp: Date.now(),
         });
       });
     }

     private recordMetric(metric: PerformanceMetric) {
       this.metrics.push({ ...metric, userId: this.userId });
       this.queueForSending({ type: "metric", data: metric });
     }

     private recordPageView() {
       const pageView = {
         url: window.location.href,
         title: document.title,
         timestamp: Date.now(),
         referrer: document.referrer,
       };
       this.pageViews.push(pageView);
       this.queueForSending({ type: "page_view", data: pageView });
     }

     private recordError(error: ClientError) {
       this.queueForSending({ type: "error", data: error });
     }

     private queueForSending(data: any) {
       this.sendQueue.push({
         ...data,
         sessionId: this.sessionId,
         userId: this.userId,
         timestamp: Date.now(),
       });
     }

     private async sendQueuedMetrics() {
       if (this.sendQueue.length === 0) return;

       try {
         await fetch("/api/v1/analytics/rum", {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
           },
           body: JSON.stringify({
             sessionId: this.sessionId,
             metrics: this.sendQueue,
           }),
         });

         this.sendQueue = [];
       } catch (error) {
         console.error("Failed to send RUM metrics:", error);
       }
     }

     private startPeriodicReporting() {
       // Send metrics every 30 seconds
       setInterval(() => {
         this.sendQueuedMetrics();
       }, 30000);
     }

     // Rating functions based on Web Vitals thresholds
     private getLCPRating(
       value: number
     ): "good" | "needs-improvement" | "poor" {
       if (value <= 2500) return "good";
       if (value <= 4000) return "needs-improvement";
       return "poor";
     }

     private getFIDRating(
       value: number
     ): "good" | "needs-improvement" | "poor" {
       if (value <= 100) return "good";
       if (value <= 300) return "needs-improvement";
       return "poor";
     }

     private getCLSRating(
       value: number
     ): "good" | "needs-improvement" | "poor" {
       if (value <= 0.1) return "good";
       if (value <= 0.25) return "needs-improvement";
       return "poor";
     }

     private getTTFBRating(
       value: number
     ): "good" | "needs-improvement" | "poor" {
       if (value <= 800) return "good";
       if (value <= 1800) return "needs-improvement";
       return "poor";
     }

     private generateSessionId(): string {
       return (
         "session_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
       );
     }

     setUserId(userId: string) {
       this.userId = userId;
     }

     // Public API for manual metric recording
     recordCustomMetric(
       name: string,
       value: number,
       rating?: "good" | "needs-improvement" | "poor"
     ) {
       this.recordMetric({
         name,
         value,
         rating: rating || "good",
         timestamp: Date.now(),
         url: window.location.href,
       });
     }
   }

   // Create global RUM instance
   export const rum = new RealUserMonitoring();
   ```

2. **RUM Analytics API** (4-5 hours)

   ```python
   # api/v1/endpoints/analytics.py
   from fastapi import APIRouter, Depends, HTTPException
   from typing import List, Dict, Any
   from models.analytics import RUMMetric, UserSession
   from services.analytics_service import AnalyticsService

   router = APIRouter(prefix="/analytics", tags=["analytics"])

   @router.post("/rum")
   async def collect_rum_metrics(
       data: Dict[str, Any],
       current_user = Depends(get_current_user_optional)  # Optional for anonymous tracking
   ):
       """Collect Real User Monitoring metrics"""

       session_id = data.get('sessionId')
       metrics = data.get('metrics', [])

       user_id = str(current_user.id) if current_user else None

       # Store metrics in database
       analytics_service = AnalyticsService()
       await analytics_service.store_rum_metrics(
           session_id=session_id,
           user_id=user_id,
           metrics=metrics
       )

       return {"status": "success", "metrics_count": len(metrics)}

   @router.get("/performance/overview")
   async def get_performance_overview(
       hours: int = Query(24, ge=1, le=168),
       current_user = Depends(require_permissions(Permission.ANALYTICS_READ))
   ):
       """Get RUM performance overview"""

       analytics_service = AnalyticsService()
       overview = await analytics_service.get_performance_overview(hours)

       return overview

   @router.get("/core-web-vitals")
   async def get_core_web_vitals(
       days: int = Query(7, ge=1, le=30),
       current_user = Depends(require_permissions(Permission.ANALYTICS_READ))
   ):
       """Get Core Web Vitals metrics"""

       analytics_service = AnalyticsService()
       vitals = await analytics_service.get_core_web_vitals(days)

       return vitals
   ```

3. **User Interaction Tracking** (3-5 hours)

   ```typescript
   // hooks/useInteractionTracking.ts
   import { useEffect, useCallback } from 'react';
   import { rum } from '../services/rum';

   export const useInteractionTracking = (componentName: string) => {
     const trackClick = useCallback((elementId: string, additionalData?: any) => {
       rum.recordCustomMetric(`click_${componentName}_${elementId}`, 1);

       // Send interaction data
       fetch('/api/v1/analytics/interaction', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${localStorage.getItem('access_token')}`
         },
         body: JSON.stringify({
           type: 'click',
           component: componentName,
           element: elementId,
           timestamp: Date.now(),
           ...additionalData
         })
       }).catch(console.error);
     }, [componentName]);

     const trackPageView = useCallback((pageName: string) => {
       rum.recordCustomMetric(`page_view_${pageName}`, 1);
     }, []);

     const trackFormSubmission = useCallback((formName: string, success: boolean) => {
       rum.recordCustomMetric(`form_submit_${formName}_${success ? 'success' : 'error'}`, 1);
     }, []);

     return {
       trackClick,
       trackPageView,
       trackFormSubmission
     };
   };

   // components/Analytics/PerformanceDashboard.tsx
   export const PerformanceDashboard: React.FC = () => {
     const [performanceData, setPerformanceData] = useState(null);
     const [coreWebVitals, setCoreWebVitals] = useState(null);

     useEffect(() => {
       fetchPerformanceData();
       fetchCoreWebVitals();
     }, []);

     const fetchPerformanceData = async () => {
       try {
         const response = await fetch('/api/v1/analytics/performance/overview', {
           headers: { 'Authorization': `Bearer ${getToken()}` }
         });
         const data = await response.json();
         setPerformanceData(data);
       } catch (error) {
         console.error('Failed to fetch performance data:', error);
       }
     };

     const fetchCoreWebVitals = async () => {
       try {
         const response = await fetch('/api/v1/analytics/core-web-vitals', {
           headers: { 'Authorization': `Bearer ${getToken()}` }
         });
         const data = await response.json();
         setCoreWebVitals(data);
       } catch (error) {
         console.error('Failed to fetch Core Web Vitals:', error);
       }
     };

     return (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <Card>
           <CardHeader>
             <CardTitle>Core Web Vitals</CardTitle>
           </CardHeader>
           <CardContent>
             {coreWebVitals && (
               <div className="space-y-4">
                 <WebVitalMetric name="LCP" value={coreWebVitals.lcp} threshold={2500} />
                 <WebVitalMetric name="FID" value={coreWebVitals.fid} threshold={100} />
                 <WebVitalMetric name="CLS" value={coreWebVitals.cls} threshold={0.1} />
               </div>
             )}
           </CardContent>
         </Card>

         <Card>
           <CardHeader>
             <CardTitle>Page Load Performance</CardTitle>
           </CardHeader>
           <CardContent>
             {performanceData && (
               <div className="space-y-2">
                 <div className="flex justify-between">
                   <span>Avg Load Time:</span>
                   <span>{performanceData.avgLoadTime}ms</span>
                 </div>
                 <div className="flex justify-between">
                   <span>TTFB:</span>
                   <span>{performanceData.ttfb}ms</span>
                 </div>
               </div>
             )}
           </CardContent>
         </Card>
       </div>
     );
   };
   ```

#### Acceptance Criteria

- [ ] Core Web Vitals monitoring (LCP, FID, CLS)
- [ ] Page load performance tracking
- [ ] User interaction analytics
- [ ] Error tracking and reporting
- [ ] Performance dashboard for administrators
- [ ] Real-time alerts for performance issues

---

### 17.3 Data Quality Monitoring ⭐⭐

**Estimated Time: 10-15 hours**

#### Scope

Monitor and report on financial data quality, completeness, and accuracy

#### Implementation Steps

1. **Data Quality Metrics** (6-8 hours)

   ```python
   # services/data_quality_service.py
   from typing import Dict, List, Any, Optional
   from datetime import datetime, timedelta
   from sqlalchemy.orm import Session
   from models.financial import FinancialData, Statement
   from enum import Enum

   class DataQualityIssue(Enum):
       MISSING_DATA = "missing_data"
       INCONSISTENT_VALUES = "inconsistent_values"
       OUTLIER_DETECTED = "outlier_detected"
       FORMULA_ERROR = "formula_error"
       NEGATIVE_BALANCE = "negative_balance"
       BALANCE_MISMATCH = "balance_mismatch"

   @dataclass
   class QualityCheck:
       check_type: DataQualityIssue
       severity: str  # 'low', 'medium', 'high', 'critical'
       description: str
       affected_records: int
       recommendation: str

   class DataQualityService:
       def __init__(self, db: Session):
           self.db = db

       async def run_quality_checks(self, statement_id: int) -> Dict[str, Any]:
           """Run comprehensive data quality checks on a financial statement"""

           statement = self.db.query(Statement).filter(Statement.id == statement_id).first()
           if not statement:
               raise ValueError(f"Statement {statement_id} not found")

           checks = []

           # Check for missing data
           missing_data_check = await self.check_missing_data(statement_id)
           if missing_data_check:
               checks.append(missing_data_check)

           # Check for inconsistent values
           consistency_check = await self.check_data_consistency(statement_id)
           if consistency_check:
               checks.append(consistency_check)

           # Check for outliers
           outlier_check = await self.check_outliers(statement_id)
           if outlier_check:
               checks.append(outlier_check)

           # Check balance sheet equation (if applicable)
           if statement.statement_type == 'balance_sheet':
               balance_check = await self.check_balance_sheet_equation(statement_id)
               if balance_check:
                   checks.append(balance_check)

           # Calculate overall quality score
           quality_score = self.calculate_quality_score(checks)

           return {
               "statement_id": statement_id,
               "quality_score": quality_score,
               "checks": checks,
               "last_checked": datetime.utcnow().isoformat(),
               "total_issues": len(checks),
               "critical_issues": len([c for c in checks if c.severity == 'critical']),
               "recommendations": self.generate_recommendations(checks)
           }

       async def check_missing_data(self, statement_id: int) -> Optional[QualityCheck]:
           """Check for missing or null financial data"""

           missing_count = self.db.query(FinancialData).filter(
               FinancialData.statement_id == statement_id,
               FinancialData.value.is_(None)
           ).count()

           total_count = self.db.query(FinancialData).filter(
               FinancialData.statement_id == statement_id
           ).count()

           if total_count == 0:
               return None

           missing_percentage = (missing_count / total_count) * 100

           if missing_percentage > 5:  # More than 5% missing data
               severity = 'critical' if missing_percentage > 20 else 'high'
               return QualityCheck(
                   check_type=DataQualityIssue.MISSING_DATA,
                   severity=severity,
                   description=f"{missing_percentage:.1f}% of financial data points are missing",
                   affected_records=missing_count,
                   recommendation="Review data import process and fill missing values"
               )
           return None

       async def check_data_consistency(self, statement_id: int) -> Optional[QualityCheck]:
           """Check for data consistency issues"""

           # Example: Check if revenue growth rates are reasonable
           revenue_data = self.db.query(FinancialData).filter(
               FinancialData.statement_id == statement_id,
               FinancialData.metric_name.ilike('%revenue%')
           ).order_by(FinancialData.period).all()

           inconsistencies = 0
           for i in range(1, len(revenue_data)):
               if revenue_data[i].value and revenue_data[i-1].value:
                   growth_rate = (revenue_data[i].value - revenue_data[i-1].value) / revenue_data[i-1].value
                   if abs(growth_rate) > 2.0:  # More than 200% change
                       inconsistencies += 1

           if inconsistencies > 0:
               return QualityCheck(
                   check_type=DataQualityIssue.INCONSISTENT_VALUES,
                   severity='medium',
                   description=f"{inconsistencies} periods show extreme revenue growth rates",
                   affected_records=inconsistencies,
                   recommendation="Verify data accuracy for periods with extreme growth rates"
               )
           return None

       async def check_outliers(self, statement_id: int) -> Optional[QualityCheck]:
           """Check for statistical outliers in financial data"""

           import numpy as np
           from scipy import stats

           financial_data = self.db.query(FinancialData).filter(
               FinancialData.statement_id == statement_id,
               FinancialData.value.isnot(None)
           ).all()

           outliers = 0
           for metric_name in set(fd.metric_name for fd in financial_data):
               values = [fd.value for fd in financial_data if fd.metric_name == metric_name]
               if len(values) > 3:
                   z_scores = np.abs(stats.zscore(values))
                   outlier_count = len([z for z in z_scores if z > 3])  # Z-score > 3
                   outliers += outlier_count

           if outliers > 0:
               return QualityCheck(
                   check_type=DataQualityIssue.OUTLIER_DETECTED,
                   severity='medium',
                   description=f"{outliers} data points identified as statistical outliers",
                   affected_records=outliers,
                   recommendation="Review outlier values for data entry errors"
               )
           return None

       async def check_balance_sheet_equation(self, statement_id: int) -> Optional[QualityCheck]:
           """Check if Assets = Liabilities + Equity"""

           # Get totals for assets, liabilities, and equity
           assets_total = self.db.query(FinancialData).filter(
               FinancialData.statement_id == statement_id,
               FinancialData.category == 'assets',
               FinancialData.is_total == True
           ).first()

           liabilities_total = self.db.query(FinancialData).filter(
               FinancialData.statement_id == statement_id,
               FinancialData.category == 'liabilities',
               FinancialData.is_total == True
           ).first()

           equity_total = self.db.query(FinancialData).filter(
               FinancialData.statement_id == statement_id,
               FinancialData.category == 'equity',
               FinancialData.is_total == True
           ).first()

           if assets_total and liabilities_total and equity_total:
               assets = assets_total.value or 0
               liabilities = liabilities_total.value or 0
               equity = equity_total.value or 0

               difference = abs(assets - (liabilities + equity))
               tolerance = max(assets * 0.01, 1000)  # 1% or $1000 tolerance

               if difference > tolerance:
                   return QualityCheck(
                       check_type=DataQualityIssue.BALANCE_MISMATCH,
                       severity='critical',
                       description=f"Balance sheet equation imbalance: {difference:,.2f}",
                       affected_records=3,
                       recommendation="Verify balance sheet calculations and data accuracy"
                   )
           return None

       def calculate_quality_score(self, checks: List[QualityCheck]) -> float:
           """Calculate overall data quality score (0-100)"""

           if not checks:
               return 100.0

           penalty_weights = {
               'low': 5,
               'medium': 15,
               'high': 30,
               'critical': 50
           }

           total_penalty = sum(penalty_weights.get(check.severity, 0) for check in checks)
           quality_score = max(0, 100 - total_penalty)

           return quality_score

       def generate_recommendations(self, checks: List[QualityCheck]) -> List[str]:
           """Generate actionable recommendations based on quality checks"""

           recommendations = []
           for check in checks:
               if check.severity in ['high', 'critical']:
                   recommendations.append(check.recommendation)

           return list(set(recommendations))  # Remove duplicates
   ```

2. **Quality Monitoring Dashboard** (4-7 hours)

   ```typescript
   // components/Analytics/DataQualityDashboard.tsx
   interface QualityCheck {
     check_type: string;
     severity: 'low' | 'medium' | 'high' | 'critical';
     description: string;
     affected_records: number;
     recommendation: string;
   }

   interface QualityReport {
     statement_id: number;
     quality_score: number;
     checks: QualityCheck[];
     last_checked: string;
     total_issues: number;
     critical_issues: number;
     recommendations: string[];
   }

   export const DataQualityDashboard: React.FC = () => {
     const [qualityReports, setQualityReports] = useState<QualityReport[]>([]);
     const [selectedStatement, setSelectedStatement] = useState<number | null>(null);
     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
       fetchQualityReports();
     }, []);

     const fetchQualityReports = async () => {
       try {
         const response = await fetch('/api/v1/data-quality/reports', {
           headers: { 'Authorization': `Bearer ${getToken()}` }
         });
         const data = await response.json();
         setQualityReports(data);
       } catch (error) {
         console.error('Failed to fetch quality reports:', error);
       } finally {
         setIsLoading(false);
       }
     };

     const runQualityCheck = async (statementId: number) => {
       try {
         await fetch(`/api/v1/data-quality/check/${statementId}`, {
           method: 'POST',
           headers: { 'Authorization': `Bearer ${getToken()}` }
         });
         await fetchQualityReports();
       } catch (error) {
         console.error('Failed to run quality check:', error);
       }
     };

     const getSeverityColor = (severity: string) => {
       switch (severity) {
         case 'critical': return 'text-red-600 bg-red-100';
         case 'high': return 'text-orange-600 bg-orange-100';
         case 'medium': return 'text-yellow-600 bg-yellow-100';
         default: return 'text-gray-600 bg-gray-100';
       }
     };

     const getQualityScoreColor = (score: number) => {
       if (score >= 90) return 'text-green-600';
       if (score >= 70) return 'text-yellow-600';
       return 'text-red-600';
     };

     if (isLoading) {
       return <div className="p-4">Loading quality reports...</div>;
     }

     return (
       <div className="p-6">
         <div className="flex justify-between items-center mb-6">
           <h1 className="text-2xl font-bold">Data Quality Dashboard</h1>
           <Button onClick={() => fetchQualityReports()}>
             <RefreshCw className="h-4 w-4 mr-2" />
             Refresh
           </Button>
         </div>

         {/* Quality Overview */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
           <Card>
             <CardContent className="p-4">
               <div className="text-2xl font-bold">
                 {qualityReports.reduce((acc, report) => acc + report.quality_score, 0) / qualityReports.length || 0}
               </div>
               <div className="text-sm text-muted-foreground">Average Quality Score</div>
             </CardContent>
           </Card>
           <Card>
             <CardContent className="p-4">
               <div className="text-2xl font-bold text-red-600">
                 {qualityReports.reduce((acc, report) => acc + report.critical_issues, 0)}
               </div>
               <div className="text-sm text-muted-foreground">Critical Issues</div>
             </CardContent>
           </Card>
           <Card>
             <CardContent className="p-4">
               <div className="text-2xl font-bold">
                 {qualityReports.reduce((acc, report) => acc + report.total_issues, 0)}
               </div>
               <div className="text-sm text-muted-foreground">Total Issues</div>
             </CardContent>
           </Card>
           <Card>
             <CardContent className="p-4">
               <div className="text-2xl font-bold text-green-600">
                 {qualityReports.filter(report => report.quality_score >= 90).length}
               </div>
               <div className="text-sm text-muted-foreground">High Quality Statements</div>
             </CardContent>
           </Card>
         </div>

         {/* Quality Reports Table */}
         <Card>
           <CardHeader>
             <CardTitle>Statement Quality Reports</CardTitle>
           </CardHeader>
           <CardContent>
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Statement ID</TableHead>
                   <TableHead>Quality Score</TableHead>
                   <TableHead>Issues</TableHead>
                   <TableHead>Critical</TableHead>
                   <TableHead>Last Checked</TableHead>
                   <TableHead>Actions</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {qualityReports.map(report => (
                   <TableRow key={report.statement_id}>
                     <TableCell>{report.statement_id}</TableCell>
                     <TableCell>
                       <span className={`font-medium ${getQualityScoreColor(report.quality_score)}`}>
                         {report.quality_score.toFixed(1)}%
                       </span>
                     </TableCell>
                     <TableCell>{report.total_issues}</TableCell>
                     <TableCell>
                       {report.critical_issues > 0 && (
                         <Badge variant="destructive">{report.critical_issues}</Badge>
                       )}
                     </TableCell>
                     <TableCell>{new Date(report.last_checked).toLocaleDateString()}</TableCell>
                     <TableCell>
                       <div className="flex gap-2">
                         <Button
                           size="sm"
                           variant="outline"
                           onClick={() => setSelectedStatement(report.statement_id)}
                         >
                           View Details
                         </Button>
                         <Button
                           size="sm"
                           onClick={() => runQualityCheck(report.statement_id)}
                         >
                           Re-check
                         </Button>
                       </div>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </CardContent>
         </Card>

         {/* Quality Details Modal */}
         {selectedStatement && (
           <QualityDetailsModal
             report={qualityReports.find(r => r.statement_id === selectedStatement)}
             onClose={() => setSelectedStatement(null)}
           />
         )}
       </div>
     );
   };
   ```

#### Acceptance Criteria

- [ ] Automated data quality checks for financial statements
- [ ] Quality score calculation and trending
- [ ] Issue detection and classification by severity
- [ ] Data quality dashboard with actionable insights
- [ ] Recommendations for data quality improvements
- [ ] Historical quality tracking and reporting

---

## Dependencies

### Internal Dependencies

- Task 04: Dashboard and visualization (performance targets)
- Task 07: Database schema (analytics tables)
- Task 16: Real-time features (WebSocket monitoring)

### External Dependencies

- Prometheus for metrics collection (optional)
- Time-series database for long-term storage (optional)
- External monitoring services (DataDog, New Relic, etc.)

## Risks & Mitigation

### High Risk

- **Performance Impact**: Monitoring may affect application performance
  - _Mitigation_: Async processing, sampling, configurable monitoring levels
- **Data Privacy**: User monitoring must comply with privacy regulations
  - _Mitigation_: Anonymization options, clear privacy policies, opt-out mechanisms

### Medium Risk

- **Storage Costs**: Metrics data can grow large quickly
  - _Mitigation_: Data retention policies, aggregation strategies
- **Alert Fatigue**: Too many alerts may reduce effectiveness
  - _Mitigation_: Smart alerting thresholds, alert prioritization

## Success Metrics

### Performance Monitoring

- API response time P95 < 2 seconds
- Database query time P95 < 500ms
- Error rate < 1%
- System uptime > 99.9%

### User Experience

- Core Web Vitals within "Good" thresholds
- Page load time < 3 seconds
- User satisfaction score > 4.0/5.0

### Data Quality

- Average data quality score > 85%
- Critical issues resolved within 24 hours
- Data completeness > 95%

## Definition of Done

- [ ] Backend performance monitoring implemented
- [ ] Real User Monitoring (RUM) operational
- [ ] Data quality monitoring system functional
- [ ] Performance dashboards accessible to administrators
- [ ] Alerting system for critical issues
- [ ] Comprehensive documentation
- [ ] Performance benchmarks established
- [ ] Code review and approval

## Post-Implementation

### Monitoring

- Performance metrics trending
- User experience score tracking
- Data quality improvement over time
- System resource utilization

### Maintenance

- Regular performance threshold reviews
- Data quality check refinements
- User feedback integration
- Continuous optimization based on metrics
