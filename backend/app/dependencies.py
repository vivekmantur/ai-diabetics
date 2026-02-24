"""
Authentication Dependencies

Provides JWT authentication utilities used to protect routes.
"""

from typing import Dict, Any

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from .auth.jwt_handler import verify_token


# ==============================
# Security Scheme
# ==============================

security = HTTPBearer(auto_error=True)


# ==============================
# Current User Dependency
# ==============================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> Dict[str, Any]:
    """
    Validate JWT token and return authenticated user payload.

    Raises:
        HTTPException: If token is invalid or expired.
    """

    token = credentials.credentials

    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Optional safety check
    if "user_id" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return payload