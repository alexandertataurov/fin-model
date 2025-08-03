from sqlalchemy import event
from sqlalchemy.orm import Session
import asyncio
import logging
from typing import Any, Dict, Optional
from datetime import datetime

from ..core.websocket_manager import websocket_manager, ChannelType
from ..models.financial import FinancialStatement
from ..models.parameter import Parameter
from ..models.report import ReportExport
from ..models.file import UploadedFile
from ..models.notification import NotificationType, NotificationPriority
from .notification_service import notification_service

logger = logging.getLogger(__name__)


class RealtimeDataService:
    """Service for handling real-time data updates and broadcasting to WebSocket clients"""
    
    def __init__(self, websocket_manager_instance=None):
        self.websocket_manager = websocket_manager_instance or websocket_manager
        self.setup_database_triggers()

    def setup_database_triggers(self):
        """Setup database event listeners for real-time updates"""
        
        # Financial data updates
        @event.listens_for(FinancialStatement, 'after_insert')
        @event.listens_for(FinancialStatement, 'after_update')
        def financial_data_changed(mapper, connection, target):
            asyncio.create_task(self.handle_financial_data_update(target))

        # Parameter updates
        @event.listens_for(Parameter, 'after_insert')
        @event.listens_for(Parameter, 'after_update')
        def parameter_changed(mapper, connection, target):
            asyncio.create_task(self.handle_parameter_update(target))

        # Report generation status updates
        @event.listens_for(ReportExport, 'after_update')
        def report_status_changed(mapper, connection, target):
            asyncio.create_task(self.handle_report_status_update(target))

        # File upload status updates
        @event.listens_for(UploadedFile, 'after_update')
        def file_status_changed(mapper, connection, target):
            asyncio.create_task(self.handle_file_status_update(target))

        logger.info("Database triggers for real-time updates have been set up")

    async def handle_financial_data_update(self, financial_statement: FinancialStatement):
        """Handle financial statement updates and broadcast to relevant dashboards"""
        try:
            message = {
                'type': 'financial_statement_update',
                'data': {
                    'id': str(financial_statement.id),
                    'scenario_id': str(financial_statement.scenario_id),
                    'statement_type': financial_statement.statement_type,
                    'period_start': financial_statement.period_start.isoformat(),
                    'period_end': financial_statement.period_end.isoformat(),
                    'currency': financial_statement.currency,
                    'updated_at': financial_statement.updated_at.isoformat() if financial_statement.updated_at else datetime.utcnow().isoformat(),
                    'change_type': 'update'
                }
            }

            # Broadcast to dashboard channel for this scenario
            dashboard_channel_id = f"scenario_{financial_statement.scenario_id}"
            await self.websocket_manager.broadcast_to_channel(
                ChannelType.DASHBOARD,
                dashboard_channel_id,
                message
            )

            # Also broadcast to financial data channel
            financial_channel_id = f"scenario_{financial_statement.scenario_id}"
            await self.websocket_manager.broadcast_to_channel(
                ChannelType.FINANCIAL_DATA,
                financial_channel_id,
                message
            )

            # Broadcast aggregated metrics update
            await self.broadcast_aggregated_metrics_update(str(financial_statement.scenario_id))

            logger.info(f"Financial statement update broadcasted for scenario {financial_statement.scenario_id}")

        except Exception as e:
            logger.error(f"Error handling financial data update: {e}")

    async def handle_parameter_update(self, parameter: Parameter):
        """Handle parameter updates and broadcast to scenario modeling"""
        try:
            message = {
                'type': 'parameter_update',
                'data': {
                    'parameter_id': str(parameter.id),
                    'name': parameter.name,
                    'value': parameter.value,
                    'file_id': str(parameter.file_id),
                    'category': parameter.category,
                    'description': parameter.description,
                    'updated_at': parameter.updated_at.isoformat() if parameter.updated_at else datetime.utcnow().isoformat(),
                    'change_type': 'update'
                }
            }

            # Broadcast to parameters channel for this file
            parameters_channel_id = f"file_{parameter.file_id}"
            await self.websocket_manager.broadcast_to_channel(
                ChannelType.PARAMETERS,
                parameters_channel_id,
                message
            )

            # Also broadcast to financial data channel for recalculations
            await self.websocket_manager.broadcast_to_channel(
                ChannelType.FINANCIAL_DATA,
                parameters_channel_id,
                message
            )

            logger.info(f"Parameter update broadcasted for parameter {parameter.name}")

        except Exception as e:
            logger.error(f"Error handling parameter update: {e}")

    async def handle_report_status_update(self, report: ReportExport):
        """Handle report generation status updates"""
        try:
            message = {
                'type': 'report_status_update',
                'data': {
                    'report_id': str(report.id),
                    'file_id': str(report.file_id),
                    'status': report.status,
                    'progress': report.progress,
                    'download_url': report.download_url,
                    'error_message': report.error_message,
                    'created_at': report.created_at.isoformat() if report.created_at else None,
                    'completed_at': report.completed_at.isoformat() if report.completed_at else None,
                    'updated_at': report.updated_at.isoformat() if report.updated_at else datetime.utcnow().isoformat()
                }
            }

            # Broadcast to reports channel
            reports_channel_id = f"file_{report.file_id}"
            await self.websocket_manager.broadcast_to_channel(
                ChannelType.REPORTS,
                reports_channel_id,
                message
            )

            # Send notification to the user who requested the report
            if report.status in ['completed', 'failed']:
                await self.send_report_notification(report)

            logger.info(f"Report status update broadcasted for report {report.id}")

        except Exception as e:
            logger.error(f"Error handling report status update: {e}")

    async def handle_file_status_update(self, file_upload: UploadedFile):
        """Handle file upload status updates"""
        try:
            message = {
                'type': 'file_status_update',
                'data': {
                    'file_id': str(file_upload.id),
                    'filename': file_upload.filename,
                    'status': file_upload.status,
                    'processing_progress': file_upload.processing_progress,
                    'error_message': file_upload.error_message,
                    'uploaded_at': file_upload.uploaded_at.isoformat() if file_upload.uploaded_at else None,
                    'processed_at': file_upload.processed_at.isoformat() if file_upload.processed_at else None,
                    'updated_at': file_upload.updated_at.isoformat() if file_upload.updated_at else datetime.utcnow().isoformat()
                }
            }

            # Broadcast to dashboard channel for this file
            dashboard_channel_id = f"file_{file_upload.id}"
            await self.websocket_manager.broadcast_to_channel(
                ChannelType.DASHBOARD,
                dashboard_channel_id,
                message
            )

            # Send notification to the user who uploaded the file
            if file_upload.status in ['processed', 'failed']:
                await self.send_file_processing_notification(file_upload)

            logger.info(f"File status update broadcasted for file {file_upload.filename}")

        except Exception as e:
            logger.error(f"Error handling file status update: {e}")

    async def broadcast_aggregated_metrics_update(self, file_id: str):
        """Broadcast aggregated metrics update for a file"""
        try:
            # This would typically calculate aggregated metrics
            # For now, we'll send a generic metrics update signal
            message = {
                'type': 'metrics_recalculation',
                'data': {
                    'file_id': str(file_id),
                    'recalculated_at': datetime.utcnow().isoformat(),
                    'trigger': 'financial_data_update'
                }
            }

            dashboard_channel_id = f"file_{file_id}"
            await self.websocket_manager.broadcast_to_channel(
                ChannelType.DASHBOARD,
                dashboard_channel_id,
                message
            )

        except Exception as e:
            logger.error(f"Error broadcasting aggregated metrics update: {e}")

    async def send_report_notification(self, report: ReportExport):
        """Send notification when report generation is complete"""
        try:
            # Use notification service to create persistent notification
            if hasattr(report, 'created_by') and report.created_by:
                # Get database session (would need to be passed or injected)
                from ..models.base import get_db
                db = next(get_db())
                
                if report.status == 'completed':
                    await notification_service.create_notification(
                        user_id=str(report.created_by),
                        notification_type=NotificationType.REPORT_READY,
                        title="Report Ready",
                        message=f"Your report is ready for download",
                        data={
                            'report_id': str(report.id),
                            'file_id': str(report.file_id),
                            'download_url': report.download_url,
                            'status': report.status
                        },
                        priority=NotificationPriority.NORMAL,
                        db=db
                    )
                else:
                    await notification_service.create_notification(
                        user_id=str(report.created_by),
                        notification_type=NotificationType.ERROR_ALERT,
                        title="Report Generation Failed",
                        message=f"Report generation failed: {report.error_message}",
                        data={
                            'report_id': str(report.id),
                            'file_id': str(report.file_id),
                            'status': report.status,
                            'error': report.error_message
                        },
                        priority=NotificationPriority.HIGH,
                        db=db
                    )

        except Exception as e:
            logger.error(f"Error sending report notification: {e}")

    async def send_file_processing_notification(self, file_upload: UploadedFile):
        """Send notification when file processing is complete"""
        try:
            # Use notification service to create persistent notification
            from ..models.base import get_db
            db = next(get_db())
            
            if file_upload.status == 'processed':
                await notification_service.create_notification(
                    user_id=str(file_upload.uploaded_by),
                    notification_type=NotificationType.FILE_PROCESSED,
                    title="File Processed",
                    message=f"File '{file_upload.filename}' has been processed successfully",
                    data={
                        'file_id': str(file_upload.id),
                        'filename': file_upload.filename,
                        'status': file_upload.status
                    },
                    priority=NotificationPriority.NORMAL,
                    db=db
                )
            else:
                await notification_service.create_notification(
                    user_id=str(file_upload.uploaded_by),
                    notification_type=NotificationType.ERROR_ALERT,
                    title="File Processing Failed",
                    message=f"Processing failed for '{file_upload.filename}': {file_upload.error_message}",
                    data={
                        'file_id': str(file_upload.id),
                        'filename': file_upload.filename,
                        'status': file_upload.status,
                        'error': file_upload.error_message
                    },
                    priority=NotificationPriority.HIGH,
                    db=db
                )

        except Exception as e:
            logger.error(f"Error sending file processing notification: {e}")

    async def broadcast_chart_data_update(
        self,
        file_id: str,
        chart_type: str,
        chart_data: Dict[str, Any],
        user_id: Optional[str] = None
    ):
        """Manually broadcast chart data updates"""
        try:
            message = {
                'type': 'chart_data_update',
                'data': {
                    'file_id': str(file_id),
                    'chart_type': chart_type,
                    'chart_data': chart_data,
                    'updated_at': datetime.utcnow().isoformat(),
                    'updated_by': user_id
                }
            }

            dashboard_channel_id = f"file_{file_id}"
            await self.websocket_manager.broadcast_to_channel(
                ChannelType.DASHBOARD,
                dashboard_channel_id,
                message,
                exclude_user=user_id  # Don't send back to the user who triggered the update
            )

            logger.info(f"Chart data update broadcasted for {chart_type} in file {file_id}")

        except Exception as e:
            logger.error(f"Error broadcasting chart data update: {e}")

    async def broadcast_metric_update(
        self,
        file_id: str,
        metric_id: str,
        metric_updates: Dict[str, Any],
        user_id: Optional[str] = None
    ):
        """Manually broadcast metric updates"""
        try:
            message = {
                'type': 'metric_update',
                'data': {
                    'file_id': str(file_id),
                    'metric_id': metric_id,
                    'updates': metric_updates,
                    'updated_at': datetime.utcnow().isoformat(),
                    'updated_by': user_id
                }
            }

            dashboard_channel_id = f"file_{file_id}"
            await self.websocket_manager.broadcast_to_channel(
                ChannelType.DASHBOARD,
                dashboard_channel_id,
                message,
                exclude_user=user_id
            )

            logger.info(f"Metric update broadcasted for metric {metric_id} in file {file_id}")

        except Exception as e:
            logger.error(f"Error broadcasting metric update: {e}")

    async def broadcast_system_notification(
        self,
        message: str,
        notification_type: str = "system_update",
        priority: str = "normal",
        target_users: Optional[list] = None
    ):
        """Broadcast system-wide notifications"""
        try:
            notification_message = {
                'type': 'notification',
                'data': {
                    'notification_type': notification_type,
                    'title': 'System Notification',
                    'message': message,
                    'priority': priority,
                    'data': {}
                }
            }

            if target_users:
                # Send to specific users
                for user_id in target_users:
                    await self.websocket_manager.send_to_user(
                        str(user_id),
                        notification_message,
                        ChannelType.NOTIFICATIONS
                    )
            else:
                # Broadcast to all notification channels
                await self.websocket_manager.broadcast_to_channel(
                    ChannelType.NOTIFICATIONS,
                    "global",
                    notification_message
                )

            logger.info(f"System notification broadcasted: {message}")

        except Exception as e:
            logger.error(f"Error broadcasting system notification: {e}")


# Global instance
realtime_service = RealtimeDataService()


async def get_realtime_service() -> RealtimeDataService:
    """Get the global realtime service instance"""
    return realtime_service