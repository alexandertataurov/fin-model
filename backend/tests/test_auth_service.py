import pytest
from unittest.mock import Mock, patch
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime, timezone

from app.services.auth_service import AuthService
from app.models.user import User
from app.models.role import Role, UserRole, RoleType
from app.schemas.user import UserCreate, UserUpdate, UserLogin


class TestAuthService:
    @pytest.fixture
    def mock_db(self):
        return Mock(spec=Session)

    @pytest.fixture
    def auth_service(self, mock_db):
        return AuthService(mock_db)

    @pytest.fixture
    def sample_user(self):
        return User(
            id=1,
            email="test@example.com",
            username="testuser",
            first_name="Test",
            last_name="User",
            full_name="Test User",
            hashed_password="$2b$12$hashed_password",
            is_active=True,
            is_verified=True,
            verification_token="test_token",
        )

    @pytest.fixture
    def sample_role(self):
        return Role(
            id=1,
            name=RoleType.VIEWER,
            description="Viewer role",
        )

    def test_get_user_by_email(self, auth_service, mock_db, sample_user):
        mock_db.query.return_value.filter.return_value.first.return_value = sample_user

        result = auth_service.get_user_by_email("test@example.com")

        assert result == sample_user
        mock_db.query.assert_called_once_with(User)

    def test_get_user_by_username(self, auth_service, mock_db, sample_user):
        mock_db.query.return_value.filter.return_value.first.return_value = sample_user

        result = auth_service.get_user_by_username("testuser")

        assert result == sample_user
        mock_db.query.assert_called_once_with(User)

    def test_get_user_by_id(self, auth_service, mock_db, sample_user):
        mock_db.query.return_value.filter.return_value.first.return_value = sample_user

        result = auth_service.get_user_by_id(1)

        assert result == sample_user
        mock_db.query.assert_called_once_with(User)

    @patch("app.services.auth_service.get_password_hash")
    @patch("app.services.auth_service.generate_secure_token")
    def test_create_user_success(
        self, mock_token, mock_hash, auth_service, mock_db, sample_role
    ):
        mock_hash.return_value = "$2b$12$hashed_password"
        mock_token.return_value = "verification_token"
        mock_db.query.return_value.filter.return_value.first.side_effect = [
            None,
            None,
            sample_role,
        ]

        user_create = UserCreate(
            email="new@example.com",
            username="newuser",
            first_name="New",
            last_name="User",
            password="Password123!",
        )

        result = auth_service.create_user(user_create)

        assert mock_db.add.call_count == 2  # User and UserRole
        assert mock_db.commit.call_count == 2
        assert mock_db.refresh.call_count == 2

    def test_create_user_email_exists(self, auth_service, mock_db, sample_user):
        mock_db.query.return_value.filter.return_value.first.return_value = sample_user

        user_create = UserCreate(
            email="test@example.com", username="newuser", password="Password123!"
        )

        with pytest.raises(HTTPException) as exc_info:
            auth_service.create_user(user_create)

        assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
        assert "already registered" in exc_info.value.detail

    def test_create_user_username_exists(self, auth_service, mock_db, sample_user):
        mock_db.query.return_value.filter.return_value.first.side_effect = [
            None,
            sample_user,
        ]

        user_create = UserCreate(
            email="new@example.com", username="testuser", password="Password123!"
        )

        with pytest.raises(HTTPException) as exc_info:
            auth_service.create_user(user_create)

        assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
        assert "already registered" in exc_info.value.detail

    @patch("app.services.auth_service.verify_password")
    def test_authenticate_user_success(
        self, mock_verify, auth_service, mock_db, sample_user
    ):
        mock_verify.return_value = True
        mock_db.query.return_value.filter.return_value.first.return_value = sample_user

        result = auth_service.authenticate_user("testuser", "password123")

        assert result == sample_user
        mock_verify.assert_called_once_with("password123", "$2b$12$hashed_password")

    @patch("app.services.auth_service.verify_password")
    def test_authenticate_user_wrong_password(
        self, mock_verify, auth_service, mock_db, sample_user
    ):
        mock_verify.return_value = False
        mock_db.query.return_value.filter.return_value.first.return_value = sample_user

        result = auth_service.authenticate_user("testuser", "wrongpassword")

        assert result is None

    def test_authenticate_user_not_found(self, auth_service, mock_db):
        mock_db.query.return_value.filter.return_value.first.return_value = None

        result = auth_service.authenticate_user("nonexistent", "password123")

        assert result is None

    def test_authenticate_user_inactive(self, auth_service, mock_db, sample_user):
        sample_user.is_active = False
        mock_db.query.return_value.filter.return_value.first.return_value = sample_user

        result = auth_service.authenticate_user("testuser", "password123")

        assert result is None

    @patch("app.services.auth_service.create_access_token")
    @patch("app.services.auth_service.create_refresh_token")
    def test_create_tokens(self, mock_refresh, mock_access, auth_service, sample_user):
        mock_access.return_value = "access_token"
        mock_refresh.return_value = "refresh_token"

        tokens = auth_service.create_user_tokens(sample_user)

        assert tokens["access_token"] == "access_token"
        assert tokens["refresh_token"] == "refresh_token"
        assert tokens["token_type"] == "bearer"

    def test_create_user_full_name_construction(
        self, auth_service, mock_db, sample_role
    ):
        with patch("app.services.auth_service.get_password_hash") as mock_hash, patch(
            "app.services.auth_service.generate_secure_token"
        ) as mock_token:
            mock_hash.return_value = "$2b$12$hashed_password"
            mock_token.return_value = "verification_token"
            mock_db.query.return_value.filter.return_value.first.side_effect = [
                None,
                None,
                sample_role,
            ]

            user_create = UserCreate(
                email="new@example.com",
                username="newuser",
                first_name="John",
                last_name="Doe",
                password="Password123!",
            )

            auth_service.create_user(user_create)

            # Verify full_name is constructed from first_name and last_name
            call_args = mock_db.add.call_args_list[0][0][0]
            assert call_args.full_name == "John Doe"

    def test_user_role_assignment(self, auth_service, mock_db, sample_role):
        with patch("app.services.auth_service.get_password_hash") as mock_hash, patch(
            "app.services.auth_service.generate_secure_token"
        ) as mock_token:
            mock_hash.return_value = "$2b$12$hashed_password"
            mock_token.return_value = "verification_token"
            mock_db.query.return_value.filter.return_value.first.side_effect = [
                None,
                None,
                sample_role,
            ]

            user_create = UserCreate(
                email="new@example.com", username="newuser", password="Password123!"
            )

            auth_service.create_user(user_create, RoleType.ADMIN)

            # Verify role assignment
            assert mock_db.add.call_count == 2
            user_role_call = mock_db.add.call_args_list[1][0][0]
            assert isinstance(user_role_call, UserRole)


class TestAuthServiceIntegration:
    """Integration tests that use actual database session"""

    @pytest.mark.integration
    def test_create_and_authenticate_user_flow(self, db_session):
        """Test complete user creation and authentication flow"""
        auth_service = AuthService(db_session)

        # Create role first
        viewer_role = Role(name=RoleType.VIEWER, description="Viewer role")
        db_session.add(viewer_role)
        db_session.commit()

        user_create = UserCreate(
            email="integration@test.com",
            username="integrationuser",
            first_name="Integration",
            last_name="Test",
            password="SecurePassword123!",
        )

        # Create user
        created_user = auth_service.create_user(user_create)
        assert created_user.email == "integration@test.com"
        assert created_user.is_active is True
        assert created_user.is_verified is False

        # Authenticate user
        authenticated_user = auth_service.authenticate_user(
            "integrationuser", "SecurePassword123!"
        )
        assert authenticated_user is not None
        assert authenticated_user.id == created_user.id

        # Test wrong password
        failed_auth = auth_service.authenticate_user("integrationuser", "wrongpassword")
        assert failed_auth is None

    @pytest.mark.integration
    def test_user_roles_assignment(self, db_session):
        """Test user role assignment during creation"""
        auth_service = AuthService(db_session)

        # Create roles
        admin_role = Role(name=RoleType.ADMIN, description="Admin role")
        editor_role = Role(name=RoleType.EDITOR, description="Editor role")
        db_session.add_all([admin_role, editor_role])
        db_session.commit()

        user_create = UserCreate(
            email="admin@test.com", username="adminuser", password="Password123!"
        )

        # Create user with admin role
        created_user = auth_service.create_user(user_create, RoleType.ADMIN)

        # Verify role assignment
        user_roles = (
            db_session.query(UserRole).filter(UserRole.user_id == created_user.id).all()
        )

        assert len(user_roles) == 1
        assert user_roles[0].role.name == RoleType.ADMIN
