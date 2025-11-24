"""Business models for authentication domain - Pydantic"""

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class User(BaseModel):
    """User business model"""
    id: int
    email: EmailStr
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class AuthCredentials(BaseModel):
    """Authentication credentials"""
    email: EmailStr
    password: str

class PasswordReset(BaseModel):
    """Password reset business model"""
    user_id: int
    token: str
    expires_at: datetime
    is_used: bool = False