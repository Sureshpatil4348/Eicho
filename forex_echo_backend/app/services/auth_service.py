"""Auth service - Professional forex architecture"""

from sqlalchemy.orm import Session
from app.database.entities.auth_entity import AuthEntity, PasswordResetTokenEntity
from app.schemas.auth_schemas import RegisterRequest
from datetime import datetime, timezone, timedelta
from typing import Optional
from app.utilities.forex_logger import forex_logger

logger = forex_logger.get_logger(__name__)

class AuthService:
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[AuthEntity]:
        """Get user by email"""
        return db.query(AuthEntity).filter(AuthEntity.email == email).first()
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> Optional[AuthEntity]:
        """Get user by ID"""
        return db.query(AuthEntity).filter(AuthEntity.id == user_id).first()
    
    @staticmethod
    def create_user(db: Session, user_data: RegisterRequest, hashed_password: str) -> AuthEntity:
        """Create new user"""
        db_user = AuthEntity(
            email=user_data.email,
            password=hashed_password,
            username=user_data.username,
            first_name=user_data.first_name,
            last_name=user_data.last_name
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def update_user_password(db: Session, user_id: int, hashed_password: str) -> bool:
        """Update user password"""
        try:
            user = db.query(AuthEntity).filter(AuthEntity.id == user_id).first()
            if user:
                user.password = hashed_password
                user.updated_at = datetime.now(timezone.utc)
                db.commit()
                return True
            return False
        except Exception as e:
            logger.error(f"Error updating password for user {user_id}: {e}")
            db.rollback()
            return False
    
    @staticmethod
    def store_reset_code(db: Session, user_id: int, code: str) -> bool:
        """Store reset code in password_reset_tokens table"""
        try:
            # Clear existing codes
            db.query(PasswordResetTokenEntity).filter(
                PasswordResetTokenEntity.user_id == user_id,
                PasswordResetTokenEntity.is_used == False
            ).update({"is_used": True})
            
            # Create new reset token
            reset_token = PasswordResetTokenEntity(
                user_id=user_id,
                token=code,
                expires_at=datetime.now(timezone.utc) + timedelta(minutes=15)
            )
            db.add(reset_token)
            db.commit()
            return True
        except Exception as e:
            logger.error(f"Error storing reset code for user {user_id}: {e}")
            db.rollback()
            return False
    
    @staticmethod
    def verify_reset_code(db: Session, email: str, code: str) -> Optional[AuthEntity]:
        """Verify reset code"""
        try:
            user = db.query(AuthEntity).filter(AuthEntity.email == email).first()
            if not user:
                return None
            
            reset_token = db.query(PasswordResetTokenEntity).filter(
                PasswordResetTokenEntity.user_id == user.id,
                PasswordResetTokenEntity.token == code,
                PasswordResetTokenEntity.expires_at > datetime.now(timezone.utc),
                PasswordResetTokenEntity.is_used == False
            ).first()
            
            if reset_token:
                # Mark as used
                reset_token.is_used = True
                db.commit()
                return user
            return None
        except Exception as e:
            logger.error(f"Error verifying reset code for {email}: {e}")
            return None