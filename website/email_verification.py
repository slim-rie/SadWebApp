import random
import string
from datetime import datetime, timedelta
from flask import current_app
from flask_mail import Message
from website import mail
from website.models import db, User, EmailVerification

def generate_verification_code():
    """Generate a 6-digit verification code."""
    return ''.join(random.choices(string.digits, k=6))

def send_verification_email(email):
    """Send verification code to user's email."""
    try:
        # Generate verification code
        verification_code = generate_verification_code()
        current_app.logger.info(f"Generated verification code for {email}")
        
        # Store verification code in database
        verification = EmailVerification(
            email=email,
            code=verification_code,
            expires_at=datetime.utcnow() + timedelta(minutes=2)
        )
        db.session.add(verification)
        db.session.commit()
        current_app.logger.info(f"Stored verification code in database for {email}")

        # Send email
        msg = Message(
            'Verify Your Email - JBR Tanching C.O',
            sender=current_app.config['MAIL_DEFAULT_SENDER'],
            recipients=[email]
        )
        msg.body = f'''Thank you for signing up with JBR Tanching C.O!

Your verification code is: {verification_code}

This code will expire in 2 minutes.

If you did not request this verification code, please ignore this email.

Best regards,
JBR Tanching C.O Team'''
        
        try:
            current_app.logger.info(f"Attempting to send email to {email}")
            current_app.logger.debug(f"Mail configuration: SERVER={current_app.config['MAIL_SERVER']}, "
                                   f"PORT={current_app.config['MAIL_PORT']}, "
                                   f"USERNAME={current_app.config['MAIL_USERNAME']}, "
                                   f"SENDER={current_app.config['MAIL_DEFAULT_SENDER']}")
            mail.send(msg)
            current_app.logger.info(f"Successfully sent verification email to {email}")
            return True
        except Exception as mail_error:
            current_app.logger.error(f"Error sending email: {str(mail_error)}")
            # Rollback the database transaction if email sending fails
            db.session.rollback()
            return False
    except Exception as e:
        current_app.logger.error(f"Error in send_verification_email: {str(e)}")
        db.session.rollback()
        return False

def verify_code(email, code):
    """Verify the code entered by the user."""
    try:
        verification = EmailVerification.query.filter_by(
            email=email,
            code=code,
            is_used=False
        ).first()

        if not verification:
            return False, "Invalid verification code"

        if verification.expires_at < datetime.utcnow():
            return False, "Verification code has expired"

        # Mark code as used
        verification.is_used = True
        db.session.commit()

        return True, "Email verified successfully"
    except Exception as e:
        current_app.logger.error(f"Error verifying code: {str(e)}")
        return False, "An error occurred during verification" 