from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List
import json
import uuid

from ....core.dependencies import get_db
from ....core.security import verify_token
from ....api.v1.endpoints.auth import get_current_user
from ....models.user import User
from ....models.collaboration import CollaborationPermission
from ....services.collaboration_service import CollaborationService, CollaborationWebSocketManager
from ....services.ai_insights_service import AIInsightsService
from ....schemas.report import ReportTemplateCreate, ReportTemplateUpdate

router = APIRouter()

# WebSocket manager instance
collaboration_manager = CollaborationWebSocketManager()
ai_service = AIInsightsService()


@router.websocket("/ws/template/{template_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    template_id: str,
    db: Session = Depends(get_db),
):
    # For WebSocket, we'll handle authentication manually
    # since Depends doesn't work the same way with WebSocket
    current_user = None
    """WebSocket endpoint for real-time collaboration"""
    
    websocket_id = await collaboration_manager.connect(
        websocket=websocket,
        template_id=template_id,
        user_id=str(current_user.id),
        db=db
    )
    
    try:
        while True:
            data = await websocket.receive_json()
            await handle_collaboration_message(data, template_id, str(current_user.id), websocket_id, db)
    except WebSocketDisconnect:
        await collaboration_manager.disconnect(
            websocket=websocket,
            template_id=template_id,
            user_id=str(current_user.id),
            websocket_id=websocket_id,
            db=db
        )


async def handle_collaboration_message(
    data: Dict[str, Any],
    template_id: str,
    user_id: str,
    websocket_id: str,
    db: Session
):
    """Handle incoming collaboration messages"""
    
    message_type = data.get('type')
    
    if message_type == 'template_edit':
        await handle_template_edit(data, template_id, user_id, db)
    elif message_type == 'cursor_move':
        await handle_cursor_move(data, template_id, user_id)
    elif message_type == 'user_activity':
        await CollaborationService.update_session_activity(websocket_id, db)


async def handle_template_edit(data: Dict[str, Any], template_id: str, user_id: str, db: Session):
    """Handle template edit messages"""
    
    edit_data = data.get('data', {})
    edit_type = edit_data.get('edit_type')
    changes = edit_data.get('changes', {})
    element_id = edit_data.get('element_id')
    
    # Record the edit
    result = await CollaborationService.record_edit(
        template_id=template_id,
        user_id=user_id,
        edit_type=edit_type,
        changes=changes,
        element_id=element_id,
        db=db
    )
    
    if result.get('success'):
        # Broadcast edit to other collaborators
        await collaboration_manager.broadcast_edit(template_id, edit_data, user_id)


async def handle_cursor_move(data: Dict[str, Any], template_id: str, user_id: str):
    """Handle cursor movement messages"""
    
    cursor_data = data.get('data', {})
    cursor_data['user_id'] = user_id
    
    # Broadcast cursor position to other collaborators
    await collaboration_manager.broadcast_edit(template_id, {
        'type': 'cursor_move',
        'data': cursor_data
    }, user_id)


# REST API endpoints for collaboration management

@router.post("/templates/{template_id}/invite")
async def invite_collaborator(
    template_id: str,
    invitation_data: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Invite a user to collaborate on a template"""
    
    email = invitation_data.get('email')
    permission = invitation_data.get('permission', 'edit')
    
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is required"
        )
    
    try:
        permission_enum = CollaborationPermission(permission)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid permission level"
        )
    
    result = await CollaborationService.invite_collaborator(
        template_id=template_id,
        inviter_id=str(current_user.id),
        invitee_email=email,
        permission=permission_enum,
        db=db
    )
    
    if not result.get('success'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get('error', 'Failed to send invitation')
        )
    
    return result


@router.post("/invitations/{collaboration_id}/accept")
async def accept_invitation(
    collaboration_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Accept a collaboration invitation"""
    
    result = await CollaborationService.accept_invitation(
        collaboration_id=collaboration_id,
        user_id=str(current_user.id),
        db=db
    )
    
    if not result.get('success'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get('error', 'Failed to accept invitation')
        )
    
    return result


@router.get("/templates/{template_id}/collaborators")
async def get_collaborators(
    template_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all collaborators for a template"""
    
    collaborators = await CollaborationService.get_collaborators(template_id, db)
    return {"collaborators": collaborators}


@router.get("/templates/{template_id}/sessions")
async def get_active_sessions(
    template_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all active collaboration sessions for a template"""
    
    sessions = await CollaborationService.get_active_sessions(template_id, db)
    return {"active_sessions": sessions}


@router.get("/templates/{template_id}/history")
async def get_edit_history(
    template_id: str,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get edit history for a template"""
    
    history = await CollaborationService.get_edit_history(template_id, limit, db)
    return {"edit_history": history}


# AI Insights endpoints

@router.post("/templates/{template_id}/ai-insights/generate")
async def generate_ai_insights(
    template_id: str,
    request_data: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate AI insights for report data"""
    
    data = request_data.get('data', {})
    analysis_type = request_data.get('analysis_type', 'comprehensive')
    
    result = await ai_service.analyze_financial_data(
        data=data,
        analysis_type=analysis_type,
        user_id=str(current_user.id),
        template_id=template_id,
        db=db
    )
    
    return result


@router.post("/templates/{template_id}/smart-recommendations")
async def get_smart_recommendations(
    template_id: str,
    request_data: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get smart recommendations for report elements"""
    
    data_context = request_data.get('data_context', {})
    user_preferences = request_data.get('user_preferences', {})
    
    suggestions = await ai_service.suggest_report_elements(
        data_context=data_context,
        user_preferences=user_preferences,
        user_id=str(current_user.id),
        template_id=template_id,
        db=db
    )
    
    return {"suggestions": suggestions}


@router.get("/templates/{template_id}/ai-insights")
async def get_ai_insights(
    template_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all AI insights for a template"""
    
    from ....models.collaboration import AIInsight
    
    insights = db.query(AIInsight).filter(
        AIInsight.report_template_id == template_id
    ).order_by(AIInsight.created_at.desc()).limit(20).all()
    
    insight_list = []
    for insight in insights:
        insight_list.append({
            "id": str(insight.id),
            "insight_type": insight.insight_type,
            "ai_response": insight.ai_response,
            "confidence_score": insight.confidence_score,
            "created_at": insight.created_at.isoformat(),
            "feedback_rating": insight.feedback_rating
        })
    
    return {"insights": insight_list}


@router.post("/ai-insights/{insight_id}/feedback")
async def submit_insight_feedback(
    insight_id: str,
    feedback_data: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit feedback for an AI insight"""
    
    from ....models.collaboration import AIInsight
    
    insight = db.query(AIInsight).filter(
        AIInsight.id == insight_id,
        AIInsight.user_id == current_user.id
    ).first()
    
    if not insight:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Insight not found"
        )
    
    rating = feedback_data.get('rating')
    comment = feedback_data.get('comment')
    
    if rating is not None:
        if not (1 <= rating <= 5):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Rating must be between 1 and 5"
            )
        insight.feedback_rating = rating
    
    if comment is not None:
        insight.feedback_comment = comment
    
    db.commit()
    
    return {"success": True, "message": "Feedback submitted successfully"}