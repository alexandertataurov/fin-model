# Task 16: Real-time Features & WebSocket Integration

## Overview

Implement real-time data updates, WebSocket integration for live dashboard metrics, collaborative features, and real-time notifications to enhance user experience and data freshness across the FinVision platform.

## Complexity: ⭐⭐⭐ HIGH

**Estimated Time: 65-85 hours**

## Prerequisites

- Backend WebSocket infrastructure (basic setup in core/websocket.py)
- Dashboard pages operational
- Authentication system complete
- Database schema with real-time triggers capability

## Task Breakdown

### 16.1 WebSocket Infrastructure Enhancement ⭐⭐

**Estimated Time: 20-25 hours**

#### Scope

Enhance existing WebSocket infrastructure for scalable real-time features

#### Implementation Steps

1. **Enhanced WebSocket Manager** (8-10 hours)

   ```python
   # core/websocket_manager.py
   from typing import Dict, List, Set
   import json
   import asyncio
   from fastapi import WebSocket, WebSocketDisconnect
   from enum import Enum

   class ChannelType(Enum):
       DASHBOARD = "dashboard"
       COLLABORATION = "collaboration"
       NOTIFICATIONS = "notifications"
       FINANCIAL_DATA = "financial_data"

   class WebSocketManager:
       def __init__(self):
           # Connection pools by channel type
           self.channels: Dict[ChannelType, Dict[str, Set[WebSocket]]] = {
               channel: {} for channel in ChannelType
           }
           # User connection mapping
           self.user_connections: Dict[str, Set[WebSocket]] = {}
           # Connection metadata
           self.connection_metadata: Dict[WebSocket, Dict] = {}

       async def connect(
           self,
           websocket: WebSocket,
           user_id: str,
           channel: ChannelType,
           channel_id: str = "global"
       ):
           await websocket.accept()

           # Add to channel
           if channel_id not in self.channels[channel]:
               self.channels[channel][channel_id] = set()
           self.channels[channel][channel_id].add(websocket)

           # Add to user connections
           if user_id not in self.user_connections:
               self.user_connections[user_id] = set()
           self.user_connections[user_id].add(websocket)

           # Store metadata
           self.connection_metadata[websocket] = {
               'user_id': user_id,
               'channel': channel,
               'channel_id': channel_id,
               'connected_at': datetime.utcnow()
           }

           print(f"User {user_id} connected to {channel.value}:{channel_id}")

       async def disconnect(self, websocket: WebSocket):
           if websocket in self.connection_metadata:
               metadata = self.connection_metadata[websocket]
               user_id = metadata['user_id']
               channel = metadata['channel']
               channel_id = metadata['channel_id']

               # Remove from channel
               if channel_id in self.channels[channel]:
                   self.channels[channel][channel_id].discard(websocket)
                   if not self.channels[channel][channel_id]:
                       del self.channels[channel][channel_id]

               # Remove from user connections
               if user_id in self.user_connections:
                   self.user_connections[user_id].discard(websocket)
                   if not self.user_connections[user_id]:
                       del self.user_connections[user_id]

               # Remove metadata
               del self.connection_metadata[websocket]

               print(f"User {user_id} disconnected from {channel.value}:{channel_id}")

       async def broadcast_to_channel(
           self,
           channel: ChannelType,
           channel_id: str,
           message: dict,
           exclude_user: str = None
       ):
           """Broadcast message to all connections in a channel"""
           if channel_id in self.channels[channel]:
               connections = self.channels[channel][channel_id].copy()
               for connection in connections:
                   try:
                       # Exclude specific user if needed
                       if exclude_user:
                           metadata = self.connection_metadata.get(connection)
                           if metadata and metadata['user_id'] == exclude_user:
                               continue

                       await connection.send_text(json.dumps(message))
                   except Exception as e:
                       print(f"Error sending message: {e}")
                       await self.disconnect(connection)

       async def send_to_user(self, user_id: str, message: dict):
           """Send message to all connections of a specific user"""
           if user_id in self.user_connections:
               connections = self.user_connections[user_id].copy()
               for connection in connections:
                   try:
                       await connection.send_text(json.dumps(message))
                   except Exception as e:
                       print(f"Error sending message to user {user_id}: {e}")
                       await self.disconnect(connection)

   # Global WebSocket manager instance
   websocket_manager = WebSocketManager()
   ```

2. **Real-time Data Triggers** (6-8 hours)

   ```python
   # services/realtime_triggers.py
   from sqlalchemy import event
   from sqlalchemy.orm import Session
   import asyncio

   class RealtimeDataService:
       def __init__(self, websocket_manager: WebSocketManager):
           self.websocket_manager = websocket_manager
           self.setup_database_triggers()

       def setup_database_triggers(self):
           """Setup database event listeners for real-time updates"""

           # Financial data updates
           @event.listens_for(FinancialData, 'after_insert')
           @event.listens_for(FinancialData, 'after_update')
           def financial_data_changed(mapper, connection, target):
               asyncio.create_task(self.handle_financial_data_update(target))

           # Parameter updates
           @event.listens_for(Parameter, 'after_update')
           def parameter_changed(mapper, connection, target):
               asyncio.create_task(self.handle_parameter_update(target))

           # Report generation status
           @event.listens_for(ReportExport, 'after_update')
           def report_status_changed(mapper, connection, target):
               asyncio.create_task(self.handle_report_status_update(target))

       async def handle_financial_data_update(self, financial_data):
           """Handle financial data updates and broadcast to relevant dashboards"""
           message = {
               'type': 'financial_data_update',
               'data': {
                   'file_id': financial_data.file_id,
                   'statement_id': financial_data.statement_id,
                   'updated_at': financial_data.updated_at.isoformat(),
                   'metric_type': financial_data.metric_type
               }
           }

           # Broadcast to dashboard channel for this file
           await self.websocket_manager.broadcast_to_channel(
               ChannelType.DASHBOARD,
               f"file_{financial_data.file_id}",
               message
           )

       async def handle_parameter_update(self, parameter):
           """Handle parameter updates and broadcast to scenario modeling"""
           message = {
               'type': 'parameter_update',
               'data': {
                   'parameter_id': str(parameter.id),
                   'name': parameter.name,
                   'value': parameter.value,
                   'file_id': parameter.file_id,
                   'updated_at': parameter.updated_at.isoformat()
               }
           }

           await self.websocket_manager.broadcast_to_channel(
               ChannelType.FINANCIAL_DATA,
               f"file_{parameter.file_id}",
               message
           )
   ```

3. **WebSocket API Endpoints** (6-7 hours)

   ```python
   # api/v1/endpoints/websocket.py
   from fastapi import WebSocket, WebSocketDisconnect, Depends
   from core.websocket_manager import websocket_manager, ChannelType

   @router.websocket("/dashboard/{file_id}")
   async def dashboard_websocket(
       websocket: WebSocket,
       file_id: int,
       current_user: User = Depends(get_current_user_ws)
   ):
       """WebSocket endpoint for real-time dashboard updates"""
       await websocket_manager.connect(
           websocket,
           str(current_user.id),
           ChannelType.DASHBOARD,
           f"file_{file_id}"
       )

       try:
           while True:
               # Keep connection alive and handle incoming messages
               data = await websocket.receive_text()
               message = json.loads(data)

               if message.get('type') == 'ping':
                   await websocket.send_text(json.dumps({'type': 'pong'}))
               elif message.get('type') == 'subscribe_metrics':
                   # Handle metric subscription requests
                   await handle_metric_subscription(current_user.id, message)

       except WebSocketDisconnect:
           await websocket_manager.disconnect(websocket)

   @router.websocket("/notifications")
   async def notifications_websocket(
       websocket: WebSocket,
       current_user: User = Depends(get_current_user_ws)
   ):
       """WebSocket endpoint for real-time notifications"""
       await websocket_manager.connect(
           websocket,
           str(current_user.id),
           ChannelType.NOTIFICATIONS
       )

       try:
           while True:
               data = await websocket.receive_text()
               # Handle notification-related messages
               await handle_notification_message(current_user.id, json.loads(data))
       except WebSocketDisconnect:
           await websocket_manager.disconnect(websocket)

   async def get_current_user_ws(
       websocket: WebSocket,
       token: str = Query(...)
   ) -> User:
       """Get current user from WebSocket query parameters"""
       try:
           payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
           user_id: str = payload.get("sub")
           if user_id is None:
               await websocket.close(code=4001, reason="Invalid token")
               raise WebSocketException("Invalid token")
           return get_user_by_id(user_id)
       except JWTError:
           await websocket.close(code=4001, reason="Invalid token")
           raise WebSocketException("Invalid token")
   ```

#### Acceptance Criteria

- [ ] Enhanced WebSocket manager with channel support
- [ ] Database triggers for real-time data updates
- [ ] WebSocket API endpoints for different features
- [ ] Connection management and cleanup
- [ ] Error handling and reconnection logic

---

### 16.2 Real-time Dashboard Updates ⭐⭐⭐

**Estimated Time: 25-35 hours**

#### Scope

Implement live dashboard metrics updates and real-time chart refreshing

#### Implementation Steps

1. **Frontend WebSocket Service** (8-10 hours)

   ```typescript
   // services/websocket.ts
   export class WebSocketService {
     private ws: WebSocket | null = null;
     private reconnectAttempts = 0;
     private maxReconnectAttempts = 5;
     private reconnectDelay = 1000;
     private subscribers: Map<string, Set<Function>> = new Map();

     constructor(
       private baseUrl: string,
       private getToken: () => string
     ) {}

     connect(endpoint: string): Promise<void> {
       return new Promise((resolve, reject) => {
         const token = this.getToken();
         const wsUrl = `${this.baseUrl}${endpoint}?token=${token}`;

         this.ws = new WebSocket(wsUrl);

         this.ws.onopen = () => {
           console.log("WebSocket connected");
           this.reconnectAttempts = 0;
           resolve();
         };

         this.ws.onmessage = (event) => {
           const message = JSON.parse(event.data);
           this.handleMessage(message);
         };

         this.ws.onclose = (event) => {
           console.log("WebSocket disconnected", event.code, event.reason);
           this.handleReconnect();
         };

         this.ws.onerror = (error) => {
           console.error("WebSocket error:", error);
           reject(error);
         };
       });
     }

     private handleMessage(message: any) {
       const { type, data } = message;

       // Notify subscribers
       if (this.subscribers.has(type)) {
         this.subscribers.get(type)?.forEach((callback) => {
           try {
             callback(data);
           } catch (error) {
             console.error("Error in WebSocket message handler:", error);
           }
         });
       }
     }

     subscribe(messageType: string, callback: Function): () => void {
       if (!this.subscribers.has(messageType)) {
         this.subscribers.set(messageType, new Set());
       }
       this.subscribers.get(messageType)!.add(callback);

       // Return unsubscribe function
       return () => {
         this.subscribers.get(messageType)?.delete(callback);
       };
     }

     send(message: any) {
       if (this.ws?.readyState === WebSocket.OPEN) {
         this.ws.send(JSON.stringify(message));
       }
     }

     private handleReconnect() {
       if (this.reconnectAttempts < this.maxReconnectAttempts) {
         this.reconnectAttempts++;
         const delay =
           this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

         setTimeout(() => {
           console.log(
             `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
           );
           this.connect(this.lastEndpoint);
         }, delay);
       }
     }

     disconnect() {
       if (this.ws) {
         this.ws.close();
         this.ws = null;
       }
     }
   }

   // Create singleton instance
   export const websocketService = new WebSocketService(
     process.env.NODE_ENV === "production"
       ? "wss://your-api-domain.com/api/v1/ws"
       : "ws://localhost:8000/api/v1/ws",
     () => localStorage.getItem("access_token") || ""
   );
   ```

2. **Real-time Dashboard Hook** (8-10 hours)

   ```typescript
   // hooks/useRealtimeDashboard.ts
   import { useEffect, useState, useCallback, useRef } from "react";
   import { websocketService } from "../services/websocket";
   import { useQuery, useQueryClient } from "@tanstack/react-query";

   export const useRealtimeDashboard = (fileId: number, period: string) => {
     const [isConnected, setIsConnected] = useState(false);
     const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
     const queryClient = useQueryClient();
     const unsubscribeRef = useRef<(() => void) | null>(null);

     // Get initial dashboard data
     const {
       data: dashboardData,
       isLoading,
       error,
     } = useQuery({
       queryKey: ["dashboard", fileId, period],
       queryFn: () => fetchDashboardData(fileId, period),
       staleTime: 30000, // Consider data stale after 30 seconds
     });

     const handleRealtimeUpdate = useCallback(
       (updateData: any) => {
         const { type, data } = updateData;

         switch (type) {
           case "financial_data_update":
             if (data.file_id === fileId) {
               // Invalidate and refetch dashboard data
               queryClient.invalidateQueries(["dashboard", fileId, period]);
               setLastUpdate(new Date());
             }
             break;

           case "metric_update":
             if (data.file_id === fileId) {
               // Update specific metrics in the cache
               queryClient.setQueryData(
                 ["dashboard", fileId, period],
                 (oldData: any) => {
                   if (!oldData) return oldData;

                   return {
                     ...oldData,
                     metrics: oldData.metrics.map((metric: any) =>
                       metric.id === data.metric_id
                         ? { ...metric, ...data.updates }
                         : metric
                     ),
                     last_updated: data.updated_at,
                   };
                 }
               );
               setLastUpdate(new Date());
             }
             break;

           case "chart_data_update":
             if (data.file_id === fileId) {
               // Update chart data in cache
               queryClient.setQueryData(
                 ["dashboard", fileId, period],
                 (oldData: any) => {
                   if (!oldData) return oldData;

                   return {
                     ...oldData,
                     charts: {
                       ...oldData.charts,
                       [data.chart_type]: data.chart_data,
                     },
                     last_updated: data.updated_at,
                   };
                 }
               );
               setLastUpdate(new Date());
             }
             break;
         }
       },
       [fileId, period, queryClient]
     );

     useEffect(() => {
       const connectWebSocket = async () => {
         try {
           await websocketService.connect(`/dashboard/${fileId}`);
           setIsConnected(true);

           // Subscribe to updates
           unsubscribeRef.current = websocketService.subscribe(
             "dashboard_update",
             handleRealtimeUpdate
           );

           // Send initial subscription message
           websocketService.send({
             type: "subscribe_metrics",
             data: { file_id: fileId, period },
           });
         } catch (error) {
           console.error("Failed to connect to WebSocket:", error);
           setIsConnected(false);
         }
       };

       connectWebSocket();

       return () => {
         if (unsubscribeRef.current) {
           unsubscribeRef.current();
         }
         websocketService.disconnect();
         setIsConnected(false);
       };
     }, [fileId, period, handleRealtimeUpdate]);

     return {
       dashboardData,
       isLoading,
       error,
       isConnected,
       lastUpdate,
     };
   };
   ```

3. **Real-time Chart Components** (9-15 hours)

   ```typescript
   // components/Charts/RealtimeChart.tsx
   import { useEffect, useState, useRef } from 'react';
   import { Line } from 'react-chartjs-2';
   import { websocketService } from '../../services/websocket';

   interface RealtimeChartProps {
     fileId: number;
     chartType: string;
     initialData: any[];
     config?: any;
   }

   export const RealtimeChart: React.FC<RealtimeChartProps> = ({
     fileId,
     chartType,
     initialData,
     config
   }) => {
     const [chartData, setChartData] = useState(initialData);
     const [isLive, setIsLive] = useState(true);
     const unsubscribeRef = useRef<(() => void) | null>(null);

     useEffect(() => {
       // Subscribe to chart-specific updates
       const handleChartUpdate = (updateData: any) => {
         if (updateData.file_id === fileId && updateData.chart_type === chartType) {
           setChartData(updateData.chart_data);
         }
       };

       unsubscribeRef.current = websocketService.subscribe(
         'chart_data_update',
         handleChartUpdate
       );

       return () => {
         if (unsubscribeRef.current) {
           unsubscribeRef.current();
         }
       };
     }, [fileId, chartType]);

     const toggleLiveUpdates = () => {
       setIsLive(!isLive);
       if (!isLive) {
         // Re-subscribe when turning live updates back on
         websocketService.send({
           type: 'subscribe_chart',
           data: { file_id: fileId, chart_type: chartType }
         });
       }
     };

     return (
       <div className="relative">
         {/* Live indicator */}
         <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-gray-400'}`} />
           <button
             onClick={toggleLiveUpdates}
             className="text-xs bg-white/80 px-2 py-1 rounded"
           >
             {isLive ? 'Live' : 'Paused'}
           </button>
         </div>

         <Line
           data={chartData}
           options={{
             ...config,
             animation: {
               duration: isLive ? 750 : 0 // Smooth animations for live updates
             },
             interaction: {
               intersect: false
             }
           }}
         />
       </div>
     );
   };

   // components/Dashboard/RealtimeMetrics.tsx
   export const RealtimeMetrics: React.FC<RealtimeMetricsProps> = ({
     fileId,
     metrics
   }) => {
     const [liveMetrics, setLiveMetrics] = useState(metrics);
     const [updates, setUpdates] = useState<Map<string, Date>>(new Map());

     useEffect(() => {
       const handleMetricUpdate = (updateData: any) => {
         if (updateData.file_id === fileId) {
           setLiveMetrics(prevMetrics =>
             prevMetrics.map(metric =>
               metric.id === updateData.metric_id
                 ? { ...metric, ...updateData.updates }
                 : metric
             )
           );

           // Track when each metric was last updated
           setUpdates(prev => new Map(prev.set(updateData.metric_id, new Date())));
         }
       };

       const unsubscribe = websocketService.subscribe(
         'metric_update',
         handleMetricUpdate
       );

       return unsubscribe;
     }, [fileId]);

     return (
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {liveMetrics.map(metric => (
           <MetricCard
             key={metric.id}
             metric={metric}
             lastUpdated={updates.get(metric.id)}
             showLiveIndicator
           />
         ))}
       </div>
     );
   };
   ```

#### Acceptance Criteria

- [ ] Real-time dashboard metric updates
- [ ] Live chart data refreshing
- [ ] WebSocket connection status indicators
- [ ] Graceful handling of connection interruptions
- [ ] Performance optimization for rapid updates
- [ ] User controls for pausing/resuming live updates

---

### 16.3 Real-time Notifications System ⭐⭐

**Estimated Time: 20-25 hours**

#### Scope

Implement comprehensive real-time notification system for user alerts

#### Implementation Steps

1. **Notification Backend Service** (10-12 hours)

   ```python
   # models/notification.py
   class Notification(Base):
       __tablename__ = "notifications"

       id = Column(UUID, primary_key=True, default=uuid4)
       user_id = Column(UUID, ForeignKey("users.id"), nullable=False)
       type = Column(Enum(NotificationType), nullable=False)
       title = Column(String, nullable=False)
       message = Column(Text, nullable=False)
       data = Column(JSON)  # Additional context data
       priority = Column(Enum(NotificationPriority), default=NotificationPriority.NORMAL)
       is_read = Column(Boolean, default=False)
       is_dismissed = Column(Boolean, default=False)
       created_at = Column(DateTime, default=datetime.utcnow)
       read_at = Column(DateTime)
       expires_at = Column(DateTime)

   class NotificationType(Enum):
       REPORT_READY = "report_ready"
       FILE_PROCESSED = "file_processed"
       ERROR_ALERT = "error_alert"
       SYSTEM_UPDATE = "system_update"
       COLLABORATION_INVITE = "collaboration_invite"
       DATA_QUALITY_ISSUE = "data_quality_issue"
       SCHEDULED_REPORT = "scheduled_report"

   class NotificationPriority(Enum):
       LOW = "low"
       NORMAL = "normal"
       HIGH = "high"
       URGENT = "urgent"

   # services/notification_service.py
   class NotificationService:
       def __init__(self, websocket_manager: WebSocketManager):
           self.websocket_manager = websocket_manager

       async def create_notification(
           self,
           user_id: str,
           notification_type: NotificationType,
           title: str,
           message: str,
           data: dict = None,
           priority: NotificationPriority = NotificationPriority.NORMAL,
           expires_at: datetime = None,
           db: Session = None
       ) -> Notification:
           """Create and send a notification"""

           notification = Notification(
               user_id=user_id,
               type=notification_type,
               title=title,
               message=message,
               data=data or {},
               priority=priority,
               expires_at=expires_at
           )

           db.add(notification)
           db.commit()
           db.refresh(notification)

           # Send real-time notification
           await self.send_realtime_notification(notification)

           return notification

       async def send_realtime_notification(self, notification: Notification):
           """Send notification via WebSocket"""
           message = {
               'type': 'notification',
               'data': {
                   'id': str(notification.id),
                   'type': notification.type.value,
                   'title': notification.title,
                   'message': notification.message,
                   'priority': notification.priority.value,
                   'created_at': notification.created_at.isoformat(),
                   'data': notification.data
               }
           }

           await self.websocket_manager.send_to_user(
               str(notification.user_id),
               message
           )

       async def mark_as_read(self, notification_id: str, user_id: str, db: Session):
           """Mark notification as read"""
           notification = db.query(Notification).filter(
               Notification.id == notification_id,
               Notification.user_id == user_id
           ).first()

           if notification:
               notification.is_read = True
               notification.read_at = datetime.utcnow()
               db.commit()

       async def bulk_mark_as_read(self, user_id: str, db: Session):
           """Mark all notifications as read for a user"""
           db.query(Notification).filter(
               Notification.user_id == user_id,
               Notification.is_read == False
           ).update({
               'is_read': True,
               'read_at': datetime.utcnow()
           })
           db.commit()
   ```

2. **Notification API Endpoints** (4-5 hours)

   ```python
   # api/v1/endpoints/notifications.py
   @router.get("/")
   async def get_notifications(
       page: int = Query(1, ge=1),
       limit: int = Query(50, ge=1, le=100),
       unread_only: bool = Query(False),
       current_user: User = Depends(get_current_active_user),
       db: Session = Depends(get_db)
   ):
       """Get user notifications with pagination"""

       query = db.query(Notification).filter(Notification.user_id == current_user.id)

       if unread_only:
           query = query.filter(Notification.is_read == False)

       # Remove expired notifications
       query = query.filter(
           or_(
               Notification.expires_at.is_(None),
               Notification.expires_at > datetime.utcnow()
           )
       )

       total = query.count()
       notifications = query.order_by(Notification.created_at.desc())\
                          .offset((page - 1) * limit)\
                          .limit(limit)\
                          .all()

       return {
           "notifications": notifications,
           "total": total,
           "page": page,
           "limit": limit,
           "unread_count": db.query(Notification).filter(
               Notification.user_id == current_user.id,
               Notification.is_read == False
           ).count()
       }

   @router.post("/{notification_id}/read")
   async def mark_notification_read(
       notification_id: str,
       current_user: User = Depends(get_current_active_user),
       db: Session = Depends(get_db)
   ):
       """Mark specific notification as read"""
       await notification_service.mark_as_read(notification_id, str(current_user.id), db)
       return {"status": "success"}

   @router.post("/mark-all-read")
   async def mark_all_notifications_read(
       current_user: User = Depends(get_current_active_user),
       db: Session = Depends(get_db)
   ):
       """Mark all notifications as read"""
       await notification_service.bulk_mark_as_read(str(current_user.id), db)
       return {"status": "success"}
   ```

3. **Frontend Notification System** (6-8 hours)

   ```typescript
   // contexts/NotificationContext.tsx
   interface NotificationContextType {
     notifications: Notification[];
     unreadCount: number;
     addNotification: (notification: Notification) => void;
     markAsRead: (id: string) => void;
     markAllAsRead: () => void;
     removeNotification: (id: string) => void;
   }

   export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
     const [notifications, setNotifications] = useState<Notification[]>([]);
     const [unreadCount, setUnreadCount] = useState(0);

     useEffect(() => {
       // Subscribe to real-time notifications
       const unsubscribe = websocketService.subscribe('notification', (data) => {
         const notification = data as Notification;
         addNotification(notification);

         // Show toast for high priority notifications
         if (notification.priority === 'high' || notification.priority === 'urgent') {
           toast({
             title: notification.title,
             description: notification.message,
             variant: notification.priority === 'urgent' ? 'destructive' : 'default'
           });
         }
       });

       return unsubscribe;
     }, []);

     const addNotification = useCallback((notification: Notification) => {
       setNotifications(prev => [notification, ...prev]);
       if (!notification.is_read) {
         setUnreadCount(prev => prev + 1);
       }
     }, []);

     const markAsRead = useCallback(async (id: string) => {
       try {
         await fetch(`/api/v1/notifications/${id}/read`, {
           method: 'POST',
           headers: { 'Authorization': `Bearer ${getToken()}` }
         });

         setNotifications(prev =>
           prev.map(notif =>
             notif.id === id ? { ...notif, is_read: true } : notif
           )
         );
         setUnreadCount(prev => Math.max(0, prev - 1));
       } catch (error) {
         console.error('Failed to mark notification as read:', error);
       }
     }, []);

     return (
       <NotificationContext.Provider value={{
         notifications,
         unreadCount,
         addNotification,
         markAsRead,
         markAllAsRead,
         removeNotification
       }}>
         {children}
       </NotificationContext.Provider>
     );
   };

   // components/Notifications/NotificationCenter.tsx
   export const NotificationCenter: React.FC = () => {
     const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
     const [isOpen, setIsOpen] = useState(false);

     return (
       <Popover open={isOpen} onOpenChange={setIsOpen}>
         <PopoverTrigger asChild>
           <Button variant="ghost" size="icon" className="relative">
             <Bell className="h-5 w-5" />
             {unreadCount > 0 && (
               <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs">
                 {unreadCount > 99 ? '99+' : unreadCount}
               </Badge>
             )}
           </Button>
         </PopoverTrigger>
         <PopoverContent className="w-80 p-0" align="end">
           <div className="flex items-center justify-between p-4 border-b">
             <h3 className="font-semibold">Notifications</h3>
             {unreadCount > 0 && (
               <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                 Mark all read
               </Button>
             )}
           </div>
           <div className="max-h-96 overflow-y-auto">
             {notifications.length === 0 ? (
               <div className="p-4 text-center text-muted-foreground">
                 No notifications
               </div>
             ) : (
               notifications.map(notification => (
                 <NotificationItem
                   key={notification.id}
                   notification={notification}
                   onMarkAsRead={markAsRead}
                 />
               ))
             )}
           </div>
         </PopoverContent>
       </Popover>
     );
   };
   ```

#### Acceptance Criteria

- [ ] Real-time notification delivery via WebSocket
- [ ] Notification center with unread count
- [ ] Toast notifications for high-priority alerts
- [ ] Mark as read functionality
- [ ] Notification persistence and history
- [ ] Different notification types and priorities

---

## Dependencies

### Internal Dependencies

- Task 02: Authentication system (user context)
- Task 04: Dashboard and visualization (live updates)
- Task 06: Reporting system (report status notifications)

### External Dependencies

- Redis for WebSocket session management (optional)
- Database triggers capability
- WebSocket-compatible hosting environment

## Risks & Mitigation

### High Risk

- **Performance Impact**: Real-time updates may overwhelm client
  - _Mitigation_: Rate limiting, batching updates, user controls
- **Connection Stability**: WebSocket connections may be unreliable
  - _Mitigation_: Automatic reconnection, fallback to polling

### Medium Risk

- **Scaling Issues**: Multiple WebSocket connections may strain server
  - _Mitigation_: Connection pooling, Redis for session management
- **Data Inconsistency**: Rapid updates may cause data conflicts
  - _Mitigation_: Proper update ordering, conflict resolution

## Success Metrics

### Performance Metrics

- WebSocket connection uptime >99%
- Real-time update latency <500ms
- Notification delivery success rate >99.5%

### User Experience Metrics

- User engagement with live features >70%
- Notification interaction rate >40%
- User satisfaction with real-time features >4.0/5.0

### Technical Metrics

- Server resource usage within acceptable limits
- Database trigger performance impact <10%
- WebSocket message throughput optimization

## Definition of Done

- [ ] Enhanced WebSocket infrastructure operational
- [ ] Real-time dashboard updates working
- [ ] Live chart data refreshing implemented
- [ ] Notification system fully functional
- [ ] Connection management and error handling
- [ ] Performance testing and optimization completed
- [ ] Comprehensive test suite with >85% coverage
- [ ] User documentation for real-time features
- [ ] Code review and approval

## Post-Implementation

### Monitoring

- WebSocket connection metrics
- Real-time update performance
- Notification delivery rates
- User engagement with live features

### Maintenance

- Connection stability improvements
- Performance optimization based on usage
- Real-time feature enhancements
- User feedback integration
