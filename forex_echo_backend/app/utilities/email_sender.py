import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import EMAIL_HOST, EMAIL_PORT, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD
from app.utilities.forex_logger import forex_logger

logger = forex_logger.get_logger(__name__)

def send_email(to_email: str, subject: str, body: str):
    """Send email using SMTP"""
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_HOST_USER
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))
        
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()
            server.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
            server.send_message(msg)
        
        logger.info(f"Email sent successfully to {to_email}")
        
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        raise

def send_reset_code_email(email: str, code: str):
    """Send password reset code email"""
    subject = "Your Password Reset Code"
    body = f"""Hi there,

You requested a password reset for your account.

Your password reset code is: {code}

This code is valid for 15 minutes. If you did not request a password reset, please ignore this email.

Thanks,
Your Trading Platform Team
"""
    send_email(email, subject, body)