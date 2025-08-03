from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, JSON, Float, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from uuid import uuid4
import enum

from .base import Base


class CollaborationPermission(enum.Enum):
    VIEW = "view"
    EDIT = "edit"
    ADMIN = "admin"


# ReportTemplate is already defined in report.py
# This class is removed to avoid table conflicts


class ReportCollaboration(Base):
    """Model for managing collaborators on report templates"""
    __tablename__ = "report_collaborations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    report_template_id = Column(Integer, ForeignKey("report_templates.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    permission = Column(Enum(CollaborationPermission), nullable=False)
    
    # Invitation tracking
    invited_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    invited_at = Column(DateTime, default=datetime.utcnow)
    accepted_at = Column(DateTime)
    
    # Status
    is_active = Column(String, default=True)
    last_seen = Column(DateTime)
    
    # Relationships
    template = relationship("ReportTemplate", back_populates="collaborations")
    user = relationship("User", foreign_keys=[user_id])
    inviter = relationship("User", foreign_keys=[invited_by])

    def __repr__(self):
        return f"<ReportCollaboration(template_id={self.report_template_id}, user_id={self.user_id}, permission={self.permission})>"


class ReportEdit(Base):
    """Model for tracking all edits made to report templates"""
    __tablename__ = "report_edits"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    report_template_id = Column(Integer, ForeignKey("report_templates.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Edit details
    edit_type = Column(String, nullable=False)  # 'element_add', 'element_update', 'element_delete', 'template_update'
    element_id = Column(String)  # ID of the element being edited (null for template-level changes)
    changes = Column(JSON, nullable=False)  # JSON object describing the changes
    
    # Metadata
    timestamp = Column(DateTime, default=datetime.utcnow)
    session_id = Column(String)  # For grouping related edits
    
    # Relationships
    template = relationship("ReportTemplate", back_populates="edits")
    user = relationship("User")

    def __repr__(self):
        return f"<ReportEdit(id={self.id}, type={self.edit_type}, timestamp={self.timestamp})>"


class AIInsight(Base):
    """Model for storing AI-generated insights for reports"""
    __tablename__ = "ai_insights"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    report_template_id = Column(Integer, ForeignKey("report_templates.id"))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Insight details
    insight_type = Column(String, nullable=False)  # 'trend_analysis', 'ratio_analysis', 'risk_assessment', etc.
    input_data = Column(JSON, nullable=False)  # The data that was analyzed
    ai_response = Column(JSON, nullable=False)  # The AI-generated insights
    confidence_score = Column(Float)  # AI confidence in the insights (0.0 to 1.0)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    model_version = Column(String)  # Version of AI model used
    processing_time_ms = Column(Integer)  # Time taken to generate insights
    
    # User feedback
    feedback_rating = Column(Integer)  # User rating of insight quality (1-5)
    feedback_comment = Column(String)  # Optional user feedback
    
    # Relationships
    template = relationship("ReportTemplate", back_populates="ai_insights")
    user = relationship("User")

    def __repr__(self):
        return f"<AIInsight(id={self.id}, type={self.insight_type}, confidence={self.confidence_score})>"


class ReportElementSuggestion(Base):
    """Model for storing AI-generated suggestions for report elements"""
    __tablename__ = "report_element_suggestions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    report_template_id = Column(Integer, ForeignKey("report_templates.id"))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Suggestion details
    element_type = Column(String, nullable=False)  # 'chart', 'table', 'metric', etc.
    element_subtype = Column(String)  # More specific type like 'line_chart', 'bar_chart'
    title = Column(String, nullable=False)
    description = Column(String)
    confidence = Column(Float, nullable=False)  # AI confidence in suggestion (0.0 to 1.0)
    
    # Configuration
    data_mapping = Column(JSON)  # Suggested data mappings
    suggested_config = Column(JSON, nullable=False)  # Suggested element configuration
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    is_accepted = Column(String, default=False)  # Whether user accepted the suggestion
    accepted_at = Column(DateTime)
    
    # Relationships
    template = relationship("ReportTemplate")
    user = relationship("User")

    def __repr__(self):
        return f"<ReportElementSuggestion(id={self.id}, type={self.element_type}, confidence={self.confidence})>"


class CollaborationSession(Base):
    """Model for tracking active collaboration sessions"""
    __tablename__ = "collaboration_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    report_template_id = Column(Integer, ForeignKey("report_templates.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Session details
    session_start = Column(DateTime, default=datetime.utcnow)
    last_activity = Column(DateTime, default=datetime.utcnow)
    session_end = Column(DateTime)
    
    # Connection details
    websocket_id = Column(String)  # For tracking WebSocket connections
    client_info = Column(JSON)  # Browser, OS, etc.
    
    # Relationships
    template = relationship("ReportTemplate")
    user = relationship("User")

    def __repr__(self):
        return f"<CollaborationSession(id={self.id}, user_id={self.user_id}, start={self.session_start})>"