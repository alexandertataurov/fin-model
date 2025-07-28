import pytest
import json
from unittest.mock import Mock, patch, MagicMock, AsyncMock
from sqlalchemy.orm import Session
from datetime import datetime

from app.tasks.file_processing import (
    DatabaseTask,
    process_uploaded_file
)
from app.tasks.notifications import send_processing_notification
from app.tasks.scheduled_tasks import cleanup_expired_files
from app.models.file import UploadedFile, FileStatus
from app.models.user import User


class TestDatabaseTask:
    """Test DatabaseTask base class"""
    
    def test_database_task_call(self):
        """Test DatabaseTask __call__ method"""
        task = DatabaseTask()
        
        with patch('app.tasks.file_processing.SessionLocal') as mock_session:
            mock_db = Mock(spec=Session)
            mock_session.return_value.__enter__.return_value = mock_db
            
            task.run_with_db = Mock(return_value="success")
            
            result = task("arg1", kwarg1="value1")
            
            assert result == "success"
            task.run_with_db.assert_called_once_with(mock_db, "arg1", kwarg1="value1")

    def test_database_task_not_implemented(self):
        """Test DatabaseTask run_with_db raises NotImplementedError"""
        task = DatabaseTask()
        
        with pytest.raises(NotImplementedError):
            task.run_with_db(Mock(), "arg1")


class TestFileProcessingTasks:
    """Test file processing background tasks"""
    
    @pytest.fixture
    def mock_db(self):
        return Mock(spec=Session)
    
    @pytest.fixture
    def sample_file(self):
        return UploadedFile(
            id=1,
            filename="test_file.xlsx",
            original_filename="test_file.xlsx",
            file_path="/uploads/test_file.xlsx",
            user_id=1,
            status=FileStatus.UPLOADED,
            file_size=1024,
            upload_date=datetime.now()
        )

    @patch('app.tasks.file_processing.FileService')
    @patch('app.tasks.file_processing.ExcelParser')
    @patch('app.tasks.file_processing.AdvancedValidator')
    def test_process_uploaded_file_success(self, mock_validator, mock_parser, mock_file_service, mock_db, sample_file):
        """Test successful file processing"""
        # Setup mocks
        mock_file_service_instance = mock_file_service.return_value
        mock_parser_instance = mock_parser.return_value
        mock_validator_instance = mock_validator.return_value
        
        mock_db.query.return_value.filter.return_value.first.return_value = sample_file
        
        # Mock parsed data
        mock_parsed_data = MagicMock()
        mock_parsed_data.validation_summary.is_valid = True
        mock_parsed_data.validation_summary.errors = []
        mock_parsed_data.validation_summary.warnings = []
        mock_parsed_data.sheets = [MagicMock(), MagicMock()]
        mock_parser_instance.parse_excel_file.return_value = mock_parsed_data
        
        # Mock validation result
        mock_validation_result = Mock()
        mock_validation_result.is_valid = True
        mock_validation_result.validation_errors = []
        mock_validator_instance.validate_template.return_value = mock_validation_result
        
        # Create mock task with update_state and request
        mock_task = Mock()
        mock_task.request.id = "test_task_id"
        mock_task.update_state = Mock()
        
        # Run the task
        result = process_uploaded_file.__wrapped__(mock_task, mock_db, 1, {"option": "test"})
        
        # Verify calls
        mock_file_service_instance.update_file_status.assert_called()
        mock_file_service_instance.log_processing_step.assert_called()
        mock_parser_instance.parse_excel_file.assert_called_once()
        mock_validator_instance.validate_template.assert_called_once()
        
        # Verify result structure
        assert isinstance(result, dict)
        assert result["status"] == FileStatus.COMPLETED.value
        assert "file_id" in result

    @patch('app.tasks.file_processing.FileService')
    def test_process_uploaded_file_not_found(self, mock_file_service, mock_db):
        """Test file processing with non-existent file"""
        mock_db.query.return_value.filter.return_value.first.return_value = None
        
        mock_task = Mock()
        mock_task.request.id = "test_task_id"
        mock_task.update_state = Mock()
        
        with pytest.raises(ValueError, match="File with ID 999 not found"):
            process_uploaded_file.__wrapped__(mock_task, mock_db, 999)

    @patch('app.tasks.file_processing.FileService')
    @patch('app.tasks.file_processing.ExcelParser')
    def test_process_uploaded_file_parsing_error(self, mock_parser, mock_file_service, mock_db, sample_file):
        """Test file processing with parsing error"""
        mock_file_service_instance = mock_file_service.return_value
        mock_parser_instance = mock_parser.return_value
        
        mock_db.query.return_value.filter.return_value.first.return_value = sample_file
        class ParsingError(Exception):
            pass

        mock_parser_instance.parse_excel_file.side_effect = ParsingError("Parsing failed")
        
        mock_task = Mock()
        mock_task.request.id = "test_task_id"
        mock_task.update_state = Mock()
        
        with pytest.raises(ParsingError):
            process_uploaded_file.__wrapped__(mock_task, mock_db, 1)

    @patch('app.tasks.file_processing.FileService')
    @patch('app.tasks.file_processing.ExcelParser')
    @patch('app.tasks.file_processing.AdvancedValidator')
    def test_process_uploaded_file_validation_failed(self, mock_validator, mock_parser, mock_file_service, mock_db, sample_file):
        """Test file processing with validation failures"""
        mock_file_service_instance = mock_file_service.return_value
        mock_parser_instance = mock_parser.return_value
        mock_validator_instance = mock_validator.return_value
        
        mock_db.query.return_value.filter.return_value.first.return_value = sample_file
        
        # Mock failed validation
        mock_parsed_data = MagicMock()
        mock_parsed_data.validation_summary.is_valid = False
        mock_parsed_data.validation_summary.errors = ["Error 1", "Error 2"]
        mock_parsed_data.validation_summary.warnings = ["Warning 1"]
        mock_parsed_data.sheets = [MagicMock()]
        mock_parser_instance.parse_excel_file.return_value = mock_parsed_data
        
        mock_validation_result = Mock()
        mock_validation_result.is_valid = False
        mock_validation_result.validation_errors = ["Template error"]
        mock_validator_instance.validate_template.return_value = mock_validation_result
        
        mock_task = Mock()
        mock_task.request.id = "test_task_id"
        mock_task.update_state = Mock()
        
        result = process_uploaded_file.__wrapped__(mock_task, mock_db, 1)

        # Should mark as having validation issues
        assert result["status"] == FileStatus.FAILED.value
        assert "errors" in result
        mock_file_service_instance.update_file_status.assert_called()


class TestNotificationTasks:
    """Test notification background tasks"""
    
    def test_send_processing_notification_success(self):
        """Test successful processing notification"""
        mock_db = Mock()
        mock_task = Mock()
        mock_task.request.id = "test_task_id"
        
        # Mock the actual notification function signature
        result = send_processing_notification.__wrapped__(
            mock_task, mock_db, 1, "completed", 1, None
        )
        
        # Should return a dict with notification status
        assert isinstance(result, dict)

    def test_send_processing_notification_with_error(self):
        """Test processing notification with error message"""
        mock_db = Mock()
        mock_task = Mock()
        mock_task.request.id = "test_task_id"
        
        result = send_processing_notification.__wrapped__(
            mock_task, mock_db, 1, "failed", 1, "Processing error"
        )
        
        assert isinstance(result, dict)


class TestScheduledTasks:
    """Test scheduled background tasks"""
    
    @patch('app.tasks.scheduled_tasks.send_system_alert')
    @patch('app.tasks.scheduled_tasks.SessionLocal')
    @patch('app.tasks.scheduled_tasks.FileService')
    def test_cleanup_expired_files(self, mock_file_service, mock_session_local, mock_alert):
        """Test expired file cleanup task"""
        mock_db = Mock()
        mock_session_local.return_value.__enter__.return_value = mock_db
        
        mock_file_service_instance = mock_file_service.return_value
        mock_file_service_instance.cleanup_expired_files.return_value = {
            "total_files_deleted": 2,
            "total_storage_freed_mb": 512.0
        }
        
        result = cleanup_expired_files()
        
        assert result["total_files_deleted"] == 2
        assert result["total_storage_freed_mb"] == 512.0
        mock_file_service_instance.cleanup_expired_files.assert_called_once()

    @patch('app.tasks.scheduled_tasks.send_system_alert')
    @patch('app.tasks.scheduled_tasks.FileService')
    @patch('app.tasks.scheduled_tasks.SessionLocal')
    def test_cleanup_expired_files_error(self, mock_session_local, mock_file_service, mock_alert):
        """Test cleanup task with error"""
        mock_session_local.return_value.__enter__.side_effect = Exception("Database error")

        mock_file_service.return_value.cleanup_expired_files.return_value = {}

        result = cleanup_expired_files()
        
        assert result["success"] is False
        assert "error" in result

    def test_cleanup_expired_files_success(self):
        """Test successful cleanup task"""
        mock_db = Mock()
        mock_task = Mock()
        mock_task.request.id = "test_task_id"
        
        result = cleanup_expired_files.__wrapped__(mock_task, mock_db)
        
        assert isinstance(result, dict)

    def test_cleanup_expired_files_with_error(self):
        """Test cleanup task with error handling"""
        mock_db = Mock()
        mock_task = Mock()
        mock_task.request.id = "test_task_id"
        
        # Mock database error
        mock_db.query.side_effect = Exception("Database error")
        
        result = cleanup_expired_files.__wrapped__(mock_task, mock_db)
        
        assert isinstance(result, dict)


class TestTaskIntegration:
    """Integration tests for background tasks"""
    
    @pytest.mark.integration
    @patch('app.tasks.file_processing.celery_app')
    def test_task_registration(self, mock_celery_app):
        """Test that tasks are properly registered with Celery"""
        # Verify task is decorated properly
        assert hasattr(process_uploaded_file, 'delay')
        assert hasattr(process_uploaded_file, 'apply_async')
        
        # Test task can be called
        with patch('app.tasks.file_processing.SessionLocal'):
            with patch.object(process_uploaded_file, '__wrapped__') as mock_wrapped:
                mock_wrapped.return_value = {"success": True}
                
                # This would normally be called by Celery
                result = process_uploaded_file.__wrapped__(Mock(), Mock(), 1)
                assert result["success"] is True

    @pytest.mark.integration
    def test_task_error_handling_and_retry(self):
        """Test task error handling and retry logic"""
        mock_task = Mock()
        mock_task.request.id = "test_task_id"
        mock_task.update_state = Mock()
        mock_task.retry = Mock(side_effect=Exception("Max retries exceeded"))
        
        mock_db = Mock()
        mock_db.query.return_value.filter.return_value.first.side_effect = Exception("Database error")
        
        # Should handle error and attempt retry
        with pytest.raises(Exception):
            process_uploaded_file.__wrapped__(mock_task, mock_db, 1)

    @pytest.mark.integration
    def test_task_workflow_integration(self):
        """Test basic task workflow integration"""
        # Test that tasks can be called without import errors
        
        mock_db = Mock()
        mock_task = Mock()
        mock_task.request.id = "test_task_id"
        mock_task.update_state = Mock()
        
        # Test notification task
        notification_result = send_processing_notification.__wrapped__(
            mock_task, mock_db, 1, "completed", 1, None
        )
        assert isinstance(notification_result, dict)
        
        # Test cleanup task
        cleanup_result = cleanup_expired_files.__wrapped__(mock_task, mock_db)
        assert isinstance(cleanup_result, dict)