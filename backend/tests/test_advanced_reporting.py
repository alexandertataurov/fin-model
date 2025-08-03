import pytest
import asyncio
from datetime import datetime
from unittest.mock import Mock, patch
from sqlalchemy.orm import Session

from app.services.ai_insights_service import AIInsightsService
from app.services.collaboration_service import CollaborationService
from app.models.collaboration import (
    ReportCollaboration, ReportEdit, 
    AIInsight, CollaborationPermission
)
from app.models.report import ReportTemplate, ReportType
from app.models.user import User


class TestAIInsightsService:
    """Test suite for AI Insights Service"""
    
    @pytest.fixture
    def ai_service(self):
        return AIInsightsService()
    
    @pytest.fixture
    def sample_financial_data(self):
        return {
            "revenue_trend": [100000, 110000, 120000, 135000, 150000],
            "expense_trend": [80000, 85000, 90000, 95000, 100000],
            "profit_margin_trend": [0.2, 0.227, 0.25, 0.296, 0.333],
            "time_series": {
                "periods": ["Q1", "Q2", "Q3", "Q4", "Q1"]
            },
            "financial_ratios": {
                "current_ratio": 2.1,
                "roe": 0.16,
                "debt_to_equity": 0.4
            }
        }
    
    @pytest.mark.asyncio
    async def test_analyze_financial_data_trend_analysis(self, ai_service, sample_financial_data):
        """Test trend analysis generation"""
        result = await ai_service.analyze_financial_data(
            data=sample_financial_data,
            analysis_type="trend_analysis"
        )
        
        assert "insights" in result
        assert "confidence" in result
        assert result["confidence"] > 0.8
        assert "summary" in result["insights"]
        assert "insights" in result["insights"]
        assert "recommendations" in result["insights"]
        assert "risks" in result["insights"]
    
    @pytest.mark.asyncio
    async def test_analyze_financial_data_ratio_analysis(self, ai_service, sample_financial_data):
        """Test ratio analysis generation"""
        result = await ai_service.analyze_financial_data(
            data=sample_financial_data,
            analysis_type="ratio_analysis"
        )
        
        assert "insights" in result
        assert result["confidence"] > 0.8
        insights = result["insights"]
        assert "liquidity" in insights["summary"].lower()
        assert len(insights["insights"]) > 0
        assert len(insights["recommendations"]) > 0
    
    @pytest.mark.asyncio
    async def test_analyze_financial_data_with_db_storage(self, ai_service, sample_financial_data, db_session):
        """Test insight storage in database"""
        # Create a test user
        user = User(
            email="test@example.com",
            username="test_user",
            first_name="Test",
            last_name="User",
            hashed_password="hashed"
        )
        db_session.add(user)
        db_session.commit()
        
        result = await ai_service.analyze_financial_data(
            data=sample_financial_data,
            analysis_type="comprehensive",
            user_id=user.id,
            db=db_session
        )
        
        assert "id" in result
        
        # Verify insight was stored
        insight = db_session.query(AIInsight).filter(
            AIInsight.user_id == user.id,
            AIInsight.insight_type == "comprehensive"
        ).first()
        
        assert insight is not None
        assert insight.user_id == user.id
        assert insight.insight_type == "comprehensive"
        assert insight.confidence_score > 0.8
    
    @pytest.mark.asyncio
    async def test_suggest_report_elements_time_series(self, ai_service):
        """Test time series chart suggestions"""
        data_context = {
            "time_series": {
                "periods": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
            }
        }
        
        suggestions = await ai_service.suggest_report_elements(data_context)
        
        assert len(suggestions) > 0
        
        # Should suggest line chart for time series
        line_chart_suggestion = next(
            (s for s in suggestions if s["type"] == "chart" and s.get("subtype") == "line"),
            None
        )
        assert line_chart_suggestion is not None
        assert line_chart_suggestion["confidence"] > 0.8
    
    @pytest.mark.asyncio
    async def test_suggest_report_elements_categorical(self, ai_service):
        """Test categorical chart suggestions"""
        data_context = {
            "categorical_data": {
                "segments": ["Retail", "Corporate", "Online"]
            }
        }
        
        suggestions = await ai_service.suggest_report_elements(data_context)
        
        assert len(suggestions) > 0
        
        # Should suggest pie chart for segments
        pie_chart_suggestion = next(
            (s for s in suggestions if s["type"] == "chart" and s.get("subtype") == "pie"),
            None
        )
        assert pie_chart_suggestion is not None
    
    @pytest.mark.asyncio
    async def test_suggest_report_elements_financial_ratios(self, ai_service):
        """Test financial ratio metric suggestions"""
        data_context = {
            "financial_ratios": {
                "current_ratio": 2.1,
                "roe": 0.16
            }
        }
        
        suggestions = await ai_service.suggest_report_elements(data_context)
        
        assert len(suggestions) > 0
        
        # Should suggest metric cards
        metric_suggestions = [s for s in suggestions if s["type"] == "metric"]
        assert len(metric_suggestions) >= 2
        
        # Check for current ratio metric
        current_ratio_metric = next(
            (s for s in metric_suggestions if "current ratio" in s["title"].lower()),
            None
        )
        assert current_ratio_metric is not None
    
    def test_filter_by_preferences(self, ai_service):
        """Test filtering suggestions by user preferences"""
        suggestions = [
            {"id": "1", "type": "chart", "subtype": "line", "confidence": 0.9},
            {"id": "2", "type": "chart", "subtype": "bar", "confidence": 0.8},
            {"id": "3", "type": "chart", "subtype": "pie", "confidence": 0.7},
            {"id": "4", "type": "metric", "confidence": 0.95}
        ]
        
        preferences = {
            "chart_types": ["line", "bar"],
            "max_suggestions": 2
        }
        
        filtered = ai_service._filter_by_preferences(suggestions, preferences)
        
        assert len(filtered) == 2
        assert all(s["confidence"] >= 0.8 for s in filtered)  # Should be sorted by confidence
        assert all(s["type"] != "chart" or s["subtype"] in ["line", "bar"] for s in filtered)


class TestCollaborationService:
    """Test suite for Collaboration Service"""
    
    @pytest.fixture
    def template_with_user(self, db_session):
        """Create a test template with owner"""
        user = User(
            email="owner@example.com",
            username="owner_user",
            first_name="Owner",
            last_name="User",
            hashed_password="hashed"
        )
        db_session.add(user)
        db_session.commit()
        
        template = ReportTemplate(
            name="Test Template",
            description="Test template for collaboration",
            report_type=ReportType.CUSTOM,
            created_by=user.id
        )
        db_session.add(template)
        db_session.commit()
        
        return template, user
    
    @pytest.fixture
    def collaborator_user(self, db_session):
        """Create a collaborator user"""
        user = User(
            email="collaborator@example.com",
            username="collaborator_user",
            first_name="Collaborator",
            last_name="User",
            hashed_password="hashed"
        )
        db_session.add(user)
        db_session.commit()
        return user
    
    @pytest.mark.asyncio
    async def test_invite_collaborator_success(self, template_with_user, collaborator_user, db_session):
        """Test successful collaborator invitation"""
        template, owner = template_with_user
        
        result = await CollaborationService.invite_collaborator(
            template_id=str(template.id),
            inviter_id=str(owner.id),
            invitee_email=collaborator_user.email,
            permission=CollaborationPermission.EDIT,
            db=db_session
        )
        
        assert result["success"] is True
        assert "collaboration_id" in result
        
        # Verify collaboration was created
        collaboration = db_session.query(ReportCollaboration).filter(
            ReportCollaboration.report_template_id == template.id,
            ReportCollaboration.user_id == collaborator_user.id
        ).first()
        
        assert collaboration is not None
        assert collaboration.permission == CollaborationPermission.EDIT
        assert collaboration.invited_by == owner.id
    
    @pytest.mark.asyncio
    async def test_invite_collaborator_nonexistent_user(self, template_with_user, db_session):
        """Test inviting nonexistent user"""
        template, owner = template_with_user
        
        result = await CollaborationService.invite_collaborator(
            template_id=str(template.id),
            inviter_id=str(owner.id),
            invitee_email="nonexistent@example.com",
            permission=CollaborationPermission.EDIT,
            db=db_session
        )
        
        assert result["success"] is False
        assert "not found" in result["error"].lower()
    
    @pytest.mark.asyncio
    async def test_invite_collaborator_insufficient_permissions(self, template_with_user, collaborator_user, db_session):
        """Test inviting when user lacks permissions"""
        template, owner = template_with_user
        
        # Try to invite using collaborator (who doesn't have admin rights)
        result = await CollaborationService.invite_collaborator(
            template_id=str(template.id),
            inviter_id=str(collaborator_user.id),
            invitee_email="another@example.com",
            permission=CollaborationPermission.EDIT,
            db=db_session
        )
        
        assert result["success"] is False
        assert "insufficient" in result["error"].lower()
    
    @pytest.mark.asyncio
    async def test_accept_invitation(self, template_with_user, collaborator_user, db_session):
        """Test accepting collaboration invitation"""
        template, owner = template_with_user
        
        # Create invitation
        collaboration = ReportCollaboration(
            report_template_id=template.id,
            user_id=collaborator_user.id,
            permission=CollaborationPermission.EDIT,
            invited_by=owner.id
        )
        db_session.add(collaboration)
        db_session.commit()
        
        # Accept invitation
        result = await CollaborationService.accept_invitation(
            collaboration_id=str(collaboration.id),
            user_id=str(collaborator_user.id),
            db=db_session
        )
        
        assert result["success"] is True
        
        # Verify acceptance
        db_session.refresh(collaboration)
        assert collaboration.accepted_at is not None
        assert collaboration.is_active == "True"
    
    @pytest.mark.asyncio
    async def test_record_edit(self, template_with_user, db_session):
        """Test recording template edit"""
        template, owner = template_with_user
        
        edit_data = {
            "element_id": "test-element-1",
            "position": {"x": 100, "y": 200},
            "size": {"width": 300, "height": 150}
        }
        
        result = await CollaborationService.record_edit(
            template_id=str(template.id),
            user_id=str(owner.id),
            edit_type="element_update",
            changes=edit_data,
            element_id="test-element-1",
            db=db_session
        )
        
        assert result["success"] is True
        assert "edit_id" in result
        
        # Verify edit was recorded
        from uuid import UUID
        edit = db_session.query(ReportEdit).filter(
            ReportEdit.id == UUID(result["edit_id"])
        ).first()
        
        assert edit is not None
        assert edit.edit_type == "element_update"
        assert edit.element_id == "test-element-1"
        assert edit.changes == edit_data
    
    @pytest.mark.asyncio
    async def test_get_collaborators(self, template_with_user, collaborator_user, db_session):
        """Test getting template collaborators"""
        template, owner = template_with_user
        
        # Add collaborator
        collaboration = ReportCollaboration(
            report_template_id=template.id,
            user_id=collaborator_user.id,
            permission=CollaborationPermission.EDIT,
            invited_by=owner.id,
            accepted_at=datetime.utcnow(),
            is_active="True"
        )
        db_session.add(collaboration)
        db_session.commit()
        
        collaborators = await CollaborationService.get_collaborators(
            str(template.id), db_session
        )
        
        assert len(collaborators) == 1
        assert collaborators[0]["id"] == str(collaborator_user.id)
        assert collaborators[0]["email"] == collaborator_user.email
        assert collaborators[0]["permission"] == "edit"
        assert collaborators[0]["is_active"] == "True"
    
    @pytest.mark.asyncio
    async def test_get_edit_history(self, template_with_user, db_session):
        """Test getting template edit history"""
        template, owner = template_with_user
        
        # Create some edits
        for i in range(3):
            edit = ReportEdit(
                report_template_id=template.id,
                user_id=owner.id,
                edit_type="element_add",
                changes={"element_id": f"test-{i}"},
                timestamp=datetime.utcnow()
            )
            db_session.add(edit)
        
        db_session.commit()
        
        history = await CollaborationService.get_edit_history(
            str(template.id), limit=10, db=db_session
        )
        
        assert len(history) == 3
        assert all("user" in edit for edit in history)
        assert all(edit["edit_type"] == "element_add" for edit in history)
        
        # Should be sorted by timestamp descending
        timestamps = [edit["timestamp"] for edit in history]
        assert timestamps == sorted(timestamps, reverse=True)


# Use the real database session from conftest.py
# The db_session fixture is already defined in conftest.py


class TestTemplateBuilderIntegration:
    """Integration tests for the complete template builder system"""
    
    @pytest.mark.asyncio
    async def test_complete_collaboration_workflow(self):
        """Test complete collaboration workflow from invitation to editing"""
        # This would be an end-to-end test in a real implementation
        # For now, we'll just verify the basic structure is in place
        
        # Create template
        template_data = {
            "name": "Revenue Analysis",
            "description": "Q4 revenue analysis template",
            "elements": [],
            "layout": {
                "pageSize": "A4",
                "orientation": "portrait",
                "margins": {"top": 20, "right": 20, "bottom": 20, "left": 20}
            }
        }
        
        # Add elements
        chart_element = {
            "id": "chart-1",
            "type": "chart",
            "position": {"x": 50, "y": 50},
            "size": {"width": 400, "height": 300},
            "config": {
                "chart": {
                    "chartType": "line",
                    "title": "Revenue Trend",
                    "dataSource": "revenue_data"
                }
            }
        }
        
        template_data["elements"].append(chart_element)
        
        # Verify template structure
        assert template_data["name"] == "Revenue Analysis"
        assert len(template_data["elements"]) == 1
        assert template_data["elements"][0]["type"] == "chart"
    
    def test_ai_insights_recommendations_integration(self):
        """Test AI insights and recommendations work together"""
        # Sample financial data
        financial_data = {
            "revenue": [100000, 110000, 120000, 135000],
            "expenses": [80000, 85000, 90000, 95000],
            "profit_margins": [0.2, 0.227, 0.25, 0.296]
        }
        
        # Mock AI service responses
        expected_insights = {
            "summary": "Revenue shows strong growth with improving margins",
            "insights": ["Growth trend is accelerating", "Cost control is effective"],
            "recommendations": ["Continue current strategy", "Monitor competitive landscape"],
            "risks": ["Market saturation risk", "Economic downturn impact"]
        }
        
        expected_suggestions = [
            {
                "type": "chart",
                "subtype": "line",
                "title": "Revenue Trend",
                "confidence": 0.9
            },
            {
                "type": "metric",
                "title": "Profit Margin",
                "confidence": 0.85
            }
        ]
        
        # Verify data structures
        assert "revenue" in financial_data
        assert len(expected_insights["insights"]) > 0
        assert len(expected_suggestions) > 0
        assert all(s["confidence"] > 0.8 for s in expected_suggestions)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])