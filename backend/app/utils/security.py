import os

from datetime import datetime, timedelta

from typing import Optional

from passlib.context import CryptContext

from jose import jwt, JWTError

from dotenv import load_dotenv


load_dotenv()


# ============================================================
# JWT Configuration
# ============================================================

SECRET_KEY = os.getenv(
    "JWT_SECRET",
    "super_secret_jwt_key_campus_lost_found_2026"
)

ALGORITHM = os.getenv(
    "JWT_ALGORITHM",
    "HS256"
)

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        "1440"
    )
)


# ============================================================
# Password Hashing
# ============================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# ============================================================
# Verify Password
# ============================================================

def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:

    return pwd_context.verify(
        plain_password,
        hashed_password
    )


# ============================================================
# Hash Password
# ============================================================

def get_password_hash(
    password: str
) -> str:

    return pwd_context.hash(
        password
    )


# ============================================================
# Create JWT
# ============================================================

def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:

    to_encode = data.copy()

    if expires_delta:

        expire = (
            datetime.utcnow()
            + expires_delta
        )

    else:

        expire = (
            datetime.utcnow()
            + timedelta(
                minutes=ACCESS_TOKEN_EXPIRE_MINUTES
            )
        )

    to_encode.update(
        {
            "exp": expire
        }
    )

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


# ============================================================
# Decode JWT
# ============================================================

def decode_access_token(
    token: str
) -> Optional[dict]:

    # Demo/offline tokens
    if token == "mock-admin-jwt-token":

        return {
            "sub": "1"
        }

    if token in [
        "mock-student-jwt-token",
        "mock-registered-jwt-token"
    ]:

        return {
            "sub": "2"
        }

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError:

        return None