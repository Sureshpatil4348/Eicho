"""Input validation utilities for enhanced security."""

import re
from typing import Optional
from sqlalchemy.orm import Session

def sanitize_email(email: str) -> str:
    """Sanitize email input."""
    if not email:
        raise ValueError("Email cannot be empty")
    
    # Basic email validation
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email.strip().lower()):
        raise ValueError("Invalid email format")
    
    return email.strip().lower()

def validate_password_strength(password: str) -> bool:
    """Validate password meets security requirements."""
    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters long")
    
    if not re.search(r'[A-Z]', password):
        raise ValueError("Password must contain at least one uppercase letter")
    
    if not re.search(r'[a-z]', password):
        raise ValueError("Password must contain at least one lowercase letter")
    
    if not re.search(r'\d', password):
        raise ValueError("Password must contain at least one digit")
    
    return True

def sanitize_string_input(input_str: str, max_length: int = 255) -> str:
    """Sanitize string input to prevent injection attacks."""
    if not input_str:
        return ""
    
    # Remove potentially dangerous characters
    sanitized = re.sub(r'[<>"\';\\]', '', input_str.strip())
    
    if len(sanitized) > max_length:
        raise ValueError(f"Input too long. Maximum {max_length} characters allowed")
    
    return sanitized

def validate_user_id(user_id: int) -> int:
    """Validate user ID is positive integer."""
    if not isinstance(user_id, int) or user_id <= 0:
        raise ValueError("Invalid user ID")
    return user_id