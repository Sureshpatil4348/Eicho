from flask import Blueprint, request, jsonify
from app.schemas.auth_schemas import RegisterRequest, LoginRequest
from app.services.auth_service import AuthService
from app.utilities.security import create_access_token, verify_password, pwd_context, decode_jwt_token
from app.database.database import get_db
from datetime import timedelta
from config import ACCESS_TOKEN_EXPIRE_MINUTES
from app.utilities.forex_logger import forex_logger
from app.utilities.email_sender import send_reset_code_email

logger = forex_logger.get_logger(__name__)

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register_user():
    """Register a new user."""
    logger.info("User registration attempt")
    try:
        data = request.get_json()
        user_data = RegisterRequest(**data)
        db = next(get_db())
        
        logger.debug(f"Registration request for email: {user_data.email}")
        
        existing_user = AuthService.get_user_by_email(db, user_data.email)
        if existing_user:
            logger.warning(f"Registration failed - email already exists: {user_data.email}")
            return jsonify({
                "message": "User with this email already exists",
                "success": False
            }), 409

        hashed_password = pwd_context.hash(user_data.password)
        AuthService.create_user(db, user_data, hashed_password)
        
        logger.info(f"User registered successfully: {user_data.email}")
        return jsonify({
            "message": "User registered successfully",
            "success": True
        }), 201

    except Exception as e:
        logger.error(f"Registration failed: {str(e)}")
        return jsonify({
            "message": f"Registration failed: {str(e)}",
            "success": False
        }), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login."""
    logger.info("User login attempt")
    try:
        data = request.get_json()
        user = LoginRequest(**data)
        db = next(get_db())
        
        logger.debug(f"Login attempt for email: {user.email}")
        
        db_user = AuthService.get_user_by_email(db, user.email)
        if not db_user:
            logger.warning(f"Login failed - user not found: {user.email}")
            return jsonify({
                "message": "Invalid credentials",
                "success": False
            }), 401
            
        if not verify_password(user.password, db_user.password):
            logger.warning(f"Login failed - invalid password for: {user.email}")
            return jsonify({
                "message": "Invalid credentials",
                "success": False
            }), 401

        access_token = create_access_token(
            data={"sub": str(db_user.id), "email": db_user.email},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        logger.info(f"Login successful for user: {db_user.username} ({user.email})")
        return jsonify({
            "message": "Login successful",
            "success": True,
            "data": {
                "access_token": access_token,
                "token_type": "bearer"
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Login failed: {str(e)}")
        return jsonify({
            "message": f"Login failed: {str(e)}",
            "success": False
        }), 500

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Send password reset code"""
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            return jsonify({
                "message": "Email is required",
                "success": False
            }), 400
        
        db = next(get_db())
        user = AuthService.get_user_by_email(db, email)
        
        if not user:
            logger.warning(f"Password reset attempt for non-existent email: {email}")
            return jsonify({
                "message": "Email not found. Please enter a correct email.",
                "success": False
            }), 404
        
        import random
        reset_code = ''.join(random.choices('0123456789', k=6))
        logger.info(f"Password reset code generated for valid email: {email}")
        
        # Store reset code in database
        if AuthService.store_reset_code(db, user.id, reset_code):
            # Send email only if code stored successfully
            try:
                send_reset_code_email(email, reset_code)
                logger.info(f"Password reset email sent successfully to: {email}")
            except Exception as e:
                logger.error(f"Failed to send reset email to {email}: {e}")
        else:
            logger.error(f"Failed to store reset code for {email}")
        
        return jsonify({
            "message": "Password reset code has been sent. Please check your inbox.",
            "success": True
        }), 200
        
    except Exception as e:
        logger.error(f"Forgot password failed: {str(e)}")
        return jsonify({
            "message": "An unexpected error occurred",
            "success": False
        }), 500

@auth_bp.route('/verify-reset-code', methods=['POST'])
def verify_reset_code():
    """Verify password reset code"""
    try:
        data = request.get_json()
        email = data.get('email')
        code = data.get('code')
        
        if not email or not code:
            return jsonify({
                "message": "Email and code are required",
                "success": False
            }), 400
        
        db = next(get_db())
        
        # Verify reset code from database
        verified_user = AuthService.verify_reset_code(db, email, code)
        if not verified_user:
            # Check if user exists to give appropriate error
            user = AuthService.get_user_by_email(db, email)
            if not user:
                return jsonify({
                    "message": "Email not found. Please enter a correct email.",
                    "success": False
                }), 404
            else:
                logger.warning(f"Invalid or expired reset code for: {email}")
                return jsonify({
                    "message": "Invalid or expired reset code",
                    "success": False
                }), 400
        
        # Code verified successfully
        reset_token = create_access_token(
            data={"sub": str(verified_user.id), "email": verified_user.email, "purpose": "password_reset"},
            expires_delta=timedelta(minutes=5)
        )
        
        logger.info(f"Reset code verified successfully for: {email}")
        return jsonify({
            "message": "Code verified successfully. You can now reset your password.",
            "success": True,
            "reset_access_token": reset_token,
            "token_type": "bearer"
        }), 200
        
    except Exception as e:
        logger.error(f"Verify reset code failed: {str(e)}")
        return jsonify({
            "message": "An unexpected error occurred",
            "success": False
        }), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Reset user password with temporary token"""
    try:
        data = request.get_json()
        reset_token = data.get('reset_token')
        new_password = data.get('new_password')
        
        if not reset_token or not new_password:
            return jsonify({
                "message": "Reset token and new password are required",
                "success": False
            }), 400
        
        payload = decode_jwt_token(reset_token)
        if not payload or payload.get('purpose') != 'password_reset':
            return jsonify({
                "message": "Invalid or unauthorized reset token",
                "success": False
            }), 400
        
        user_id = payload.get('sub')
        if not user_id:
            return jsonify({
                "message": "Invalid token payload",
                "success": False
            }), 400
        
        db = next(get_db())
        hashed_password = pwd_context.hash(new_password)
        success = AuthService.update_user_password(db, int(user_id), hashed_password)
        
        if not success:
            return jsonify({
                "message": "Failed to update password",
                "success": False
            }), 500
        
        return jsonify({
            "message": "Password reset successful. You can now log in with your new password.",
            "success": True
        }), 200
        
    except Exception as e:
        logger.error(f"Reset password failed: {str(e)}")
        return jsonify({
            "message": "An unexpected error occurred",
            "success": False
        }), 500

@auth_bp.route('/me', methods=['GET'])
def get_me():
    """Get current user details"""
    try:
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({
                "message": "Authorization header missing or invalid",
                "success": False
            }), 401
        
        token = auth_header.split(' ')[1]
        payload = decode_jwt_token(token)
        
        if not payload:
            return jsonify({
                "message": "Invalid or expired token",
                "success": False
            }), 401
        
        user_id = payload.get('sub')
        if not user_id:
            return jsonify({
                "message": "Invalid token payload",
                "success": False
            }), 401
        
        db = next(get_db())
        user = AuthService.get_user_by_id(db, int(user_id))
        
        if not user:
            return jsonify({
                "message": "User not found",
                "success": False
            }), 404
        
        return jsonify({
            "success": True,
            "data": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "created_at": user.created_at.isoformat(),
                "updated_at": user.updated_at.isoformat()
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Get user details failed: {str(e)}")
        return jsonify({
            "message": f"Failed to get user details: {str(e)}",
            "success": False
        }), 500