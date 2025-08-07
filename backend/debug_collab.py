import asyncio
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.base import Base
from app.models.user import User
# Note: Report, collaboration, and notification models removed in lean version
from app.models.mfa import MFAToken, OAuthAccount, WebAuthnCredential, MFAChallenge
from app.models.role import UserRole
from app.models.file import UploadedFile
from app.models.parameter import Parameter, Scenario

# Create test database
engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

async def test_basic_functionality():
    db = TestingSessionLocal()
    
    try:
        # Create test user
        user = User(
            email="test@example.com",
            username="test_user",
            first_name="Test",
            last_name="User",
            hashed_password="hashed"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        print(f"User created successfully: {user.email}")
        print(f"User ID: {user.id}")
        
        # Test basic database functionality
        users = db.query(User).all()
        print(f"Total users in database: {len(users)}")
        
        print("Basic functionality test completed successfully!")
            
    except Exception as e:
        print(f"Exception: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(test_basic_functionality()) 