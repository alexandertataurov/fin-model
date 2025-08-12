from datetime import datetime
from typing import Any, Dict, List, Optional

from app.core.dependencies import (
    UserWithPermissions,
    get_current_user_with_permissions,
    require_permissions,
)
from app.core.permissions import Permission
from app.models.audit import AuditLog
from app.models.base import get_db
from app.models.file import UploadedFile
from app.models.financial import FinancialStatement
from app.models.role import RoleType
from app.models.user import User
from app.schemas.user import AdminUserCreate, AdminUserUpdate
from app.schemas.user import User as UserSchema
from app.services.auth_service import AuthService
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from pydantic import BaseModel
from sqlalchemy import desc, func
from sqlalchemy.orm import Session

router = APIRouter()


class UserActivityResponse(BaseModel):
    user_id: int
    username: str
    last_login: Optional[datetime]
    login_count: int
    files_uploaded: int
    models_created: int
    is_active: bool


class BulkUserActionRequest(BaseModel):
    user_ids: List[int]
    action: str


@router.get("/users/activity-list", response_model=List[UserActivityResponse])
async def get_user_activity(
    request: Request,
    limit: int = Query(50, ge=1, le=1000),
    active_only: bool = Query(False),
    current_user: User = Depends(require_permissions(Permission.ADMIN_READ)),
    db: Session = Depends(get_db),
):
    """Get user activity statistics."""
    try:
        # Parse params defensively
        qp = request.query_params
        limit_raw = qp.get("limit")
        try:
            limit_val = int(limit_raw) if limit_raw is not None else 50
        except Exception:
            limit_val = 50
        active_raw = qp.get("active_only")
        active_only_bool = (
            str(active_raw).lower() in {"true", "1", "yes"}
            if active_raw is not None
            else False
        )

        # Aggregate counts using joins
        file_counts = (
            db.query(
                UploadedFile.user_id.label("user_id"),
                func.count(UploadedFile.id).label("files_uploaded"),
            )
            .group_by(UploadedFile.user_id)
            .subquery()
        )
        model_counts = (
            db.query(
                FinancialStatement.created_by_id.label("user_id"),
                func.count(FinancialStatement.id).label("models_created"),
            )
            .group_by(FinancialStatement.created_by_id)
            .subquery()
        )
        login_counts = (
            db.query(
                AuditLog.user_id.label("user_id"),
                func.count(AuditLog.id).label("login_count"),
            )
            .filter(AuditLog.action == "LOGIN", AuditLog.success == "true")
            .group_by(AuditLog.user_id)
            .subquery()
        )

        query = (
            db.query(
                User.id.label("user_id"),
                User.username,
                User.last_login,
                User.is_active,
                func.coalesce(file_counts.c.files_uploaded, 0).label("files_uploaded"),
                func.coalesce(model_counts.c.models_created, 0).label("models_created"),
                func.coalesce(login_counts.c.login_count, 0).label("login_count"),
            )
            .outerjoin(file_counts, User.id == file_counts.c.user_id)
            .outerjoin(model_counts, User.id == model_counts.c.user_id)
            .outerjoin(login_counts, User.id == login_counts.c.user_id)
        )

        if active_only_bool:
            query = query.filter(User.is_active.is_(True))

        results = query.order_by(desc(User.created_at)).limit(limit_val).all()

        return [
            UserActivityResponse(
                user_id=row.user_id,
                username=row.username,
                last_login=row.last_login,
                login_count=row.login_count,
                files_uploaded=row.files_uploaded,
                models_created=row.models_created,
                is_active=bool(row.is_active),
            )
            for row in results
        ]

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user activity: {str(e)}",
        )


@router.get("/users", response_model=Any)
def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    envelope: bool = Query(False, description="Return pagination envelope"),
    is_active: Optional[bool] = Query(None, description="Filter by active"),
    is_admin: Optional[bool] = Query(None, description="Filter by admin"),
    is_verified: Optional[bool] = Query(None, description="Filter verified"),
    search: Optional[str] = Query(None, description="Search users"),
    created_after: Optional[datetime] = Query(None, description="Created after"),
    created_before: Optional[datetime] = Query(None, description="Created before"),
    current_user: User = Depends(require_permissions(Permission.USER_LIST)),
    db: Session = Depends(get_db),
) -> Any:
    """List all users with advanced filtering (Admin only)."""
    from app.core.admin_exceptions import (
        create_pagination_response,
        handle_admin_error,
        validate_pagination_params,
    )

    try:
        validate_pagination_params(skip, limit)
        auth_service = AuthService(db)
        base_query = db.query(User)

        if is_active is not None:
            base_query = base_query.filter(User.is_active == is_active)
        if is_admin is not None:
            base_query = base_query.filter(User.is_admin == is_admin)
        if is_verified is not None:
            base_query = base_query.filter(User.is_verified == is_verified)
        if search:
            search_term = f"%{search}%"
            base_query = base_query.filter(
                (User.username.ilike(search_term))
                | (User.email.ilike(search_term))
                | (User.full_name.ilike(search_term))
            )
        if created_after:
            base_query = base_query.filter(User.created_at >= created_after)
        if created_before:
            base_query = base_query.filter(User.created_at <= created_before)

        total = base_query.count()
        users = (
            base_query.order_by(desc(User.created_at)).offset(skip).limit(limit).all()
        )

        users_with_roles = []
        for user in users:
            user_roles = auth_service.get_user_roles(user.id)
            user_dict = UserSchema.model_validate(user).model_dump()
            user_dict["roles"] = user_roles
            users_with_roles.append(user_dict)

        return create_pagination_response(
            items=users_with_roles,
            total=total,
            skip=skip,
            limit=limit,
            envelope=envelope,
        )

    except Exception as e:
        raise handle_admin_error(e, "list users", current_user.id)


@router.get("/users/{user_id}", response_model=Any)
def get_user(
    user_id: int,
    current_user: User = Depends(require_permissions(Permission.USER_READ)),
    db: Session = Depends(get_db),
) -> Any:
    """Get user by ID."""
    auth_service = AuthService(db)

    user = auth_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    user_roles = auth_service.get_user_roles(user.id)
    user_dict = UserSchema.model_validate(user).model_dump()
    user_dict["roles"] = user_roles

    return user_dict


@router.post("/users", response_model=Any, status_code=status.HTTP_201_CREATED)
def create_user(
    user_create: AdminUserCreate,
    current_user: User = Depends(require_permissions(Permission.USER_CREATE)),
    db: Session = Depends(get_db),
) -> Any:
    """Create a new user (Admin only)."""
    auth_service = AuthService(db)

    created = auth_service.create_user(
        user_create,
        role=user_create.role or RoleType.VIEWER,
    )

    roles = auth_service.get_user_roles(created.id)
    user_dict = UserSchema.model_validate(created).model_dump()
    user_dict["roles"] = roles
    try:
        db.add(
            AuditLog(
                user_id=current_user.id,
                action="PROFILE_UPDATED",
                resource="user",
                resource_id=str(created.id),
                details=f"Created user {created.username}",
                success="true",
            )
        )
        db.commit()
    except Exception:
        db.rollback()
    return user_dict


@router.put("/users/{user_id}", response_model=UserSchema)
def update_user(
    user_id: int,
    user_update: AdminUserUpdate,
    current_user: User = Depends(require_permissions(Permission.USER_UPDATE)),
    db: Session = Depends(get_db),
) -> Any:
    """Update user information."""
    auth_service = AuthService(db)

    user = auth_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    update_data = user_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    try:
        db.add(
            AuditLog(
                user_id=current_user.id,
                action="PROFILE_UPDATED",
                resource="user",
                resource_id=str(user.id),
                details=f"Updated user {user.username}",
                success="true",
            )
        )
        db.commit()
    except Exception:
        db.rollback()

    return user


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    current_user: User = Depends(require_permissions(Permission.USER_DELETE)),
    db: Session = Depends(get_db),
) -> Any:
    """Delete user (Admin only)."""
    auth_service = AuthService(db)

    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account",
        )

    user = auth_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    user.is_active = False
    db.commit()

    try:
        db.add(
            AuditLog(
                user_id=current_user.id,
                action="PROFILE_UPDATED",
                resource="user",
                resource_id=str(user.id),
                details=f"Deactivated user {user.username}",
                success="true",
            )
        )
        db.commit()
    except Exception:
        db.rollback()

    return {"message": "User deactivated successfully"}


@router.post("/users/{user_id}/roles/{role}")
def assign_role(
    user_id: int,
    role: RoleType,
    current_user: User = Depends(require_permissions(Permission.ROLE_ASSIGN)),
    db: Session = Depends(get_db),
) -> Any:
    """Assign role to user."""
    auth_service = AuthService(db)

    user = auth_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    current_roles = auth_service.get_user_roles(user_id)
    if role.value in current_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User already has {role.value} role",
        )

    success = auth_service.assign_role(user_id, role, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to assign role",
        )

    try:
        db.add(
            AuditLog(
                user_id=current_user.id,
                action="ROLE_ASSIGNED",
                resource="user",
                resource_id=str(user_id),
                details=f"Assigned role {role.value} to user {user_id}",
                success="true",
            )
        )
        db.commit()
    except Exception:
        db.rollback()

    return {"message": f"Role {role.value} assigned successfully"}


@router.delete("/users/{user_id}/roles/{role}")
def remove_role(
    user_id: int,
    role: RoleType,
    current_user: User = Depends(require_permissions(Permission.ROLE_REMOVE)),
    db: Session = Depends(get_db),
) -> Any:
    """Remove role from user."""
    auth_service = AuthService(db)

    user = auth_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    current_roles = auth_service.get_user_roles(user_id)
    if role.value not in current_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User does not have {role.value} role",
        )

    if len(current_roles) == 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot remove the last role from user",
        )

    from app.models.role import Role, UserRole

    user_role = (
        db.query(UserRole)
        .join(Role)
        .filter(
            UserRole.user_id == user_id,
            Role.name == role,
            UserRole.is_active.is_(True),
        )
        .first()
    )

    if user_role:
        user_role.is_active = False
        db.commit()

    try:
        db.add(
            AuditLog(
                user_id=current_user.id,
                action="ROLE_REMOVED",
                resource="user",
                resource_id=str(user_id),
                details=f"Removed role {role.value} from user {user_id}",
                success="true",
            )
        )
        db.commit()
    except Exception:
        db.rollback()

    return {"message": f"Role {role.value} removed successfully"}


@router.get("/permissions")
def get_user_permissions(
    user_with_perms: UserWithPermissions = Depends(get_current_user_with_permissions),
) -> Any:
    """Get current user's permissions."""
    return {
        "user_id": user_with_perms.user.id,
        "roles": user_with_perms.roles,
        "permissions": [p.value for p in user_with_perms.permissions],
        "is_admin": user_with_perms.is_admin(),
        "is_analyst": user_with_perms.is_analyst(),
    }


@router.post("/users/bulk-action", response_model=Dict[str, Any])
async def bulk_user_action(
    request: BulkUserActionRequest,
    current_user: User = Depends(require_permissions(Permission.ADMIN_WRITE)),
    db: Session = Depends(get_db),
):
    """Perform bulk actions on users."""
    try:
        if request.action not in {
            "activate",
            "deactivate",
            "verify",
            "send_reminder",
        }:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid action",
            )

        affected_users = db.query(User).filter(User.id.in_(request.user_ids)).all()

        if not affected_users:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No users found with provided IDs",
            )

        results = {"success": 0, "failed": 0, "errors": []}

        for user in affected_users:
            try:
                if request.action == "activate":
                    user.is_active = True
                elif request.action == "deactivate":
                    if user.id == current_user.id:
                        results["failed"] += 1
                        msg = "Cannot deactivate your own account " f"(user {user.id})"
                        results["errors"].append(msg)
                        continue
                    user.is_active = False
                elif request.action == "verify":
                    user.is_verified = True
                elif request.action == "send_reminder":
                    pass

                results["success"] += 1

            except Exception as e:
                results["failed"] += 1
                results["errors"].append(
                    f"Failed to {request.action} user {user.id}: {str(e)}"
                )

        db.commit()

        return {
            "message": f"Bulk action '{request.action}' completed",
            "results": results,
            "total_users": len(request.user_ids),
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to perform bulk action: {str(e)}",
        )
