from typing import Dict, List, Optional, Any
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import WebSocket
import json
import uuid

from ..models.collaboration import (
    ReportCollaboration, ReportEdit, 
    CollaborationSession, CollaborationPermission
)
from ..models.report import ReportTemplate
from ..models.user import User


class CollaborationService:
    """Service for managing collaborative report editing"""
    
    @staticmethod
    async def invite_collaborator(
        template_id: str,
        inviter_id: str,
        invitee_email: str,
        permission: CollaborationPermission,
        db: Session
    ) -> Dict[str, Any]:
        """Send collaboration invitation to a user"""
        
        try:
            # Convert string IDs to integers for database queries
            template_id_int = int(template_id)
            inviter_id_int = int(inviter_id)
            
            # Check if template exists and inviter has admin permission
            template = db.query(ReportTemplate).filter(
                ReportTemplate.id == template_id_int
            ).first()
            
            if not template:
                return {"success": False, "error": "Template not found"}
            
            # Check inviter permissions
            if template.created_by != inviter_id_int:
                inviter_collab = db.query(ReportCollaboration).filter(
                    ReportCollaboration.report_template_id == template_id_int,
                    ReportCollaboration.user_id == inviter_id_int,
                    ReportCollaboration.permission == CollaborationPermission.ADMIN
                ).first()
                
                if not inviter_collab:
                    return {"success": False, "error": "Insufficient permissions"}
            
            # Find invitee user
            invitee = db.query(User).filter(User.email == invitee_email).first()
            if not invitee:
                return {"success": False, "error": "User not found"}
            
            # Check if collaboration already exists
            existing_collab = db.query(ReportCollaboration).filter(
                ReportCollaboration.report_template_id == template_id_int,
                ReportCollaboration.user_id == invitee.id
            ).first()
            
            if existing_collab:
                return {"success": False, "error": "User is already a collaborator"}
            
            # Create collaboration invitation
            collaboration = ReportCollaboration(
                report_template_id=template_id_int,
                user_id=invitee.id,
                permission=permission,
                invited_by=inviter_id_int,
                invited_at=datetime.utcnow()
            )
            
            db.add(collaboration)
            db.commit()
            db.refresh(collaboration)
            
            # TODO: Send email notification to invitee
            
            return {
                "success": True,
                "collaboration_id": str(collaboration.id),
                "message": f"Invitation sent to {invitee_email}"
            }
            
        except Exception as e:
            db.rollback()
            return {"success": False, "error": str(e)}
    
    @staticmethod
    async def accept_invitation(
        collaboration_id: str,
        user_id: str,
        db: Session
    ) -> Dict[str, Any]:
        """Accept a collaboration invitation"""
        
        try:
            from uuid import UUID
            collaboration_id_uuid = UUID(collaboration_id)
            user_id_int = int(user_id)
            
            collaboration = db.query(ReportCollaboration).filter(
                ReportCollaboration.id == collaboration_id_uuid,
                ReportCollaboration.user_id == user_id_int
            ).first()
            
            if not collaboration:
                return {"success": False, "error": "Invitation not found"}
            
            if collaboration.accepted_at:
                return {"success": False, "error": "Invitation already accepted"}
            
            # Accept invitation
            collaboration.accepted_at = datetime.utcnow()
            collaboration.is_active = "True"
            
            db.commit()
            
            return {"success": True, "message": "Invitation accepted"}
            
        except Exception as e:
            db.rollback()
            return {"success": False, "error": str(e)}
    
    @staticmethod
    async def get_collaborators(template_id: str, db: Session) -> List[Dict[str, Any]]:
        """Get all collaborators for a template"""
        
        collaborations = db.query(ReportCollaboration).filter(
            ReportCollaboration.report_template_id == template_id,
            ReportCollaboration.is_active == "True"
        ).all()
        
        collaborators = []
        for collab in collaborations:
            user = collab.user
            collaborators.append({
                "id": str(user.id),
                "name": f"{user.first_name} {user.last_name}",
                "email": user.email,
                "permission": collab.permission.value,
                "accepted_at": collab.accepted_at.isoformat() if collab.accepted_at else None,
                "last_seen": collab.last_seen.isoformat() if collab.last_seen else None,
                "is_active": collab.is_active
            })
        
        return collaborators
    
    @staticmethod
    async def record_edit(
        template_id: str,
        user_id: str,
        edit_type: str,
        changes: Dict[str, Any],
        element_id: Optional[str] = None,
        session_id: Optional[str] = None,
        db: Session = None
    ) -> Dict[str, Any]:
        """Record an edit made to a template"""
        
        try:
            # Check user has edit permissions
            if not await CollaborationService._has_edit_permission(template_id, user_id, db):
                return {"success": False, "error": "Insufficient permissions"}
            
            edit = ReportEdit(
                report_template_id=template_id,
                user_id=user_id,
                edit_type=edit_type,
                element_id=element_id,
                changes=changes,
                session_id=session_id or str(uuid.uuid4())
            )
            
            db.add(edit)
            db.commit()
            db.refresh(edit)
            
            return {
                "success": True,
                "edit_id": str(edit.id),
                "timestamp": edit.timestamp.isoformat()
            }
            
        except Exception as e:
            if db:
                db.rollback()
            return {"success": False, "error": str(e)}
    
    @staticmethod
    async def get_edit_history(
        template_id: str,
        limit: int = 100,
        db: Session = None
    ) -> List[Dict[str, Any]]:
        """Get edit history for a template"""
        
        edits = db.query(ReportEdit).filter(
            ReportEdit.report_template_id == template_id
        ).order_by(ReportEdit.timestamp.desc()).limit(limit).all()
        
        edit_history = []
        for edit in edits:
            user = edit.user
            edit_history.append({
                "id": str(edit.id),
                "edit_type": edit.edit_type,
                "element_id": edit.element_id,
                "changes": edit.changes,
                "timestamp": edit.timestamp.isoformat(),
                "user": {
                    "id": str(user.id),
                    "name": f"{user.first_name} {user.last_name}",
                    "email": user.email
                }
            })
        
        return edit_history
    
    @staticmethod
    async def start_collaboration_session(
        template_id: str,
        user_id: str,
        websocket_id: str,
        client_info: Dict[str, Any],
        db: Session
    ) -> Dict[str, Any]:
        """Start a new collaboration session"""
        
        try:
            # Check user has access to template
            if not await CollaborationService._has_view_permission(template_id, user_id, db):
                return {"success": False, "error": "Access denied"}
            
            # End any existing sessions for this user/template
            existing_sessions = db.query(CollaborationSession).filter(
                CollaborationSession.report_template_id == template_id,
                CollaborationSession.user_id == user_id,
                CollaborationSession.session_end.is_(None)
            ).all()
            
            for session in existing_sessions:
                session.session_end = datetime.utcnow()
            
            # Create new session
            session = CollaborationSession(
                report_template_id=template_id,
                user_id=user_id,
                websocket_id=websocket_id,
                client_info=client_info
            )
            
            db.add(session)
            db.commit()
            db.refresh(session)
            
            return {
                "success": True,
                "session_id": str(session.id)
            }
            
        except Exception as e:
            db.rollback()
            return {"success": False, "error": str(e)}
    
    @staticmethod
    async def end_collaboration_session(
        session_id: str,
        db: Session
    ) -> Dict[str, Any]:
        """End a collaboration session"""
        
        try:
            session = db.query(CollaborationSession).filter(
                CollaborationSession.id == session_id
            ).first()
            
            if session:
                session.session_end = datetime.utcnow()
                db.commit()
            
            return {"success": True}
            
        except Exception as e:
            db.rollback()
            return {"success": False, "error": str(e)}
    
    @staticmethod
    async def update_session_activity(
        session_id: str,
        db: Session
    ) -> None:
        """Update last activity timestamp for a session"""
        
        try:
            session = db.query(CollaborationSession).filter(
                CollaborationSession.id == session_id
            ).first()
            
            if session:
                session.last_activity = datetime.utcnow()
                db.commit()
                
        except Exception:
            if db:
                db.rollback()
    
    @staticmethod
    async def get_active_sessions(template_id: str, db: Session) -> List[Dict[str, Any]]:
        """Get all active collaboration sessions for a template"""
        
        sessions = db.query(CollaborationSession).filter(
            CollaborationSession.report_template_id == template_id,
            CollaborationSession.session_end.is_(None)
        ).all()
        
        active_sessions = []
        for session in sessions:
            user = session.user
            active_sessions.append({
                "session_id": str(session.id),
                "user": {
                    "id": str(user.id),
                    "name": f"{user.first_name} {user.last_name}",
                    "email": user.email
                },
                "session_start": session.session_start.isoformat(),
                "last_activity": session.last_activity.isoformat(),
                "websocket_id": session.websocket_id
            })
        
        return active_sessions
    
    @staticmethod
    async def _has_view_permission(template_id: str, user_id: str, db: Session) -> bool:
        """Check if user has view permission for a template"""
        
        # Check if user is the creator
        template = db.query(ReportTemplate).filter(
            ReportTemplate.id == template_id,
            ReportTemplate.created_by == user_id
        ).first()
        
        if template:
            return True
        
        # Check if user is a collaborator
        collaboration = db.query(ReportCollaboration).filter(
            ReportCollaboration.report_template_id == template_id,
            ReportCollaboration.user_id == user_id,
            ReportCollaboration.is_active == True
        ).first()
        
        return collaboration is not None
    
    @staticmethod
    async def _has_edit_permission(template_id: str, user_id: str, db: Session) -> bool:
        """Check if user has edit permission for a template"""
        
        # Check if user is the creator
        template = db.query(ReportTemplate).filter(
            ReportTemplate.id == template_id,
            ReportTemplate.created_by == user_id
        ).first()
        
        if template:
            return True
        
        # Check if user is a collaborator with edit or admin permission
        collaboration = db.query(ReportCollaboration).filter(
            ReportCollaboration.report_template_id == template_id,
            ReportCollaboration.user_id == user_id,
            ReportCollaboration.is_active == True,
            ReportCollaboration.permission.in_([
                CollaborationPermission.EDIT,
                CollaborationPermission.ADMIN
            ])
        ).first()
        
        return collaboration is not None


class CollaborationWebSocketManager:
    """WebSocket manager for real-time collaboration"""
    
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.user_sessions: Dict[str, Dict[str, str]] = {}  # websocket_id -> {user_id, template_id}
    
    async def connect(self, websocket: WebSocket, template_id: str, user_id: str, db: Session):
        """Accept WebSocket connection and add to template room"""
        
        await websocket.accept()
        
        websocket_id = str(uuid.uuid4())
        
        if template_id not in self.active_connections:
            self.active_connections[template_id] = []
        
        self.active_connections[template_id].append(websocket)
        self.user_sessions[websocket_id] = {
            "user_id": user_id,
            "template_id": template_id,
            "websocket": websocket
        }
        
        # Start collaboration session
        await CollaborationService.start_collaboration_session(
            template_id=template_id,
            user_id=user_id,
            websocket_id=websocket_id,
            client_info={"connection_time": datetime.utcnow().isoformat()},
            db=db
        )
        
        # Notify other users of new collaborator
        await self.broadcast_user_presence(template_id, user_id, 'joined', exclude_websocket=websocket)
        
        return websocket_id
    
    async def disconnect(self, websocket: WebSocket, template_id: str, user_id: str, websocket_id: str, db: Session):
        """Remove WebSocket connection"""
        
        if template_id in self.active_connections:
            try:
                self.active_connections[template_id].remove(websocket)
                if not self.active_connections[template_id]:
                    del self.active_connections[template_id]
            except ValueError:
                pass
        
        if websocket_id in self.user_sessions:
            del self.user_sessions[websocket_id]
        
        # End collaboration session
        # Note: In a real implementation, you'd need to track session IDs
        
        # Notify other users
        await self.broadcast_user_presence(template_id, user_id, 'left')
    
    async def broadcast_edit(self, template_id: str, edit_data: Dict[str, Any], sender_id: str):
        """Broadcast edit to all connected collaborators"""
        
        if template_id in self.active_connections:
            message = {
                'type': 'template_edit',
                'data': edit_data,
                'sender_id': sender_id,
                'timestamp': datetime.utcnow().isoformat()
            }
            
            disconnected = []
            for websocket in self.active_connections[template_id]:
                try:
                    await websocket.send_json(message)
                except Exception:
                    disconnected.append(websocket)
            
            # Remove disconnected websockets
            for ws in disconnected:
                try:
                    self.active_connections[template_id].remove(ws)
                except ValueError:
                    pass
    
    async def broadcast_user_presence(self, template_id: str, user_id: str, action: str, exclude_websocket: WebSocket = None):
        """Broadcast user presence changes"""
        
        if template_id in self.active_connections:
            message = {
                'type': 'user_presence',
                'data': {
                    'user_id': user_id,
                    'action': action,
                    'timestamp': datetime.utcnow().isoformat()
                }
            }
            
            for websocket in self.active_connections[template_id]:
                if websocket != exclude_websocket:
                    try:
                        await websocket.send_json(message)
                    except Exception:
                        pass
    
    async def send_to_user(self, template_id: str, user_id: str, message: Dict[str, Any]):
        """Send message to specific user"""
        
        if template_id in self.active_connections:
            for ws_id, session in self.user_sessions.items():
                if session['user_id'] == user_id and session['template_id'] == template_id:
                    try:
                        await session['websocket'].send_json(message)
                    except Exception:
                        pass