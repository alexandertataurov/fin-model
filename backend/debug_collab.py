import asyncio
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.base import Base
from app.models.user import User
from app.models.report import ReportTemplate, ReportType
from app.models.collaboration import CollaborationPermission
from app.models.mfa import MFAToken, OAuthAccount, WebAuthnCredential, MFAChallenge
from app.models.notification import Notification, NotificationPreference
from app.models.role import UserRole
from app.models.audit import AuditLog
from app.models.file import UploadedFile
from app.models.parameter import Parameter, Scenario
from app.services.collaboration_service import CollaborationService

# Create test database
engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

async def test_collaboration():
    db = TestingSessionLocal()
    
    try:
        # Create test user
        user = User(
            email="owner@example.com",
            username="owner_user",
            first_name="Owner",
            last_name="User",
            hashed_password="hashed"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        # Create collaborator user
        collaborator = User(
            email="collaborator@example.com",
            username="collaborator_user",
            first_name="Collaborator",
            last_name="User",
            hashed_password="hashed"
        )
        db.add(collaborator)
        db.commit()
        db.refresh(collaborator)
        
        # Create template
        template = ReportTemplate(
            name="Test Template",
            description="Test template for collaboration",
            report_type=ReportType.CUSTOM,
            created_by=user.id
        )
        db.add(template)
        db.commit()
        db.refresh(template)
        
        print(f"User ID: {user.id} (type: {type(user.id)})")
        print(f"Template ID: {template.id} (type: {type(template.id)})")
        print(f"Collaborator ID: {collaborator.id} (type: {type(collaborator.id)})")
        
        # Test collaboration invitation
        result = await CollaborationService.invite_collaborator(
            template_id=str(template.id),
            inviter_id=str(user.id),
            invitee_email=collaborator.email,
            permission=CollaborationPermission.EDIT,
            db=db
        )
        
        print(f"Result: {result}")
        
        if result["success"]:
            print("Success!")
        else:
            print(f"Error: {result.get('error', 'Unknown error')}")
            
    except Exception as e:
        print(f"Exception: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(test_collaboration()) 