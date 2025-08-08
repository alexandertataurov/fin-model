from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.base import get_db


router = APIRouter()


@router.get("/test-utils/reset-token")
def get_reset_token(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not user.password_reset_token:
        raise HTTPException(status_code=404, detail="Token not found")
    return {"token": user.password_reset_token}
