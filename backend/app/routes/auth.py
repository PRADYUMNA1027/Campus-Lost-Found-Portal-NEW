import os

from dotenv import load_dotenv

# ============================================================
# Load environment variables before reading Google credentials
# ============================================================

load_dotenv()


from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    Request,
)

from fastapi.responses import RedirectResponse

from sqlalchemy.orm import Session

from authlib.integrations.starlette_client import OAuth

from app.database.session import get_db
from app.models.user import User

from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
)

from app.utils.security import (
    get_password_hash,
    verify_password,
    create_access_token,
)

from app.middleware.auth import get_current_user


# ============================================================
# Router
# ============================================================

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


# ============================================================
# Google OAuth Configuration
# ============================================================

oauth = OAuth()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

GOOGLE_REDIRECT_URI = os.getenv(
    "GOOGLE_REDIRECT_URI",
    "http://127.0.0.1:8000/api/auth/google/callback",
)

# Frontend URL
FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:3000",
)


# ============================================================
# Register Google OAuth
# ============================================================

if GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET:

    oauth.register(
        name="google",

        client_id=GOOGLE_CLIENT_ID,

        client_secret=GOOGLE_CLIENT_SECRET,

        server_metadata_url=(
            "https://accounts.google.com/"
            ".well-known/openid-configuration"
        ),

        client_kwargs={
            "scope": "openid email profile"
        },
    )


# ============================================================
# Normal Registration
# ============================================================

@router.post(
    "/register",
    response_model=TokenResponse,
)
def register(
    user_in: UserCreate,
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Check existing account
    # --------------------------------------------------------

    existing_user = (
        db.query(User)
        .filter(
            User.email == user_in.email.lower()
        )
        .first()
    )

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists.",
        )

    # --------------------------------------------------------
    # Determine user role
    # --------------------------------------------------------

    role = (
        "admin"
        if user_in.email.lower().startswith("admin@")
        else "student"
    )

    # --------------------------------------------------------
    # Create user
    # --------------------------------------------------------

    new_user = User(
        name=user_in.name,
        email=user_in.email.lower(),
        password_hash=get_password_hash(
            user_in.password
        ),
        role=role,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # --------------------------------------------------------
    # Create JWT
    # --------------------------------------------------------

    access_token = create_access_token(
        data={
            "sub": str(new_user.id)
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user,
    }


# ============================================================
# Normal Login
# ============================================================

@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    credentials: UserLogin,
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Find user
    # --------------------------------------------------------

    user = (
        db.query(User)
        .filter(
            User.email == credentials.email.lower()
        )
        .first()
    )

    # --------------------------------------------------------
    # User not found
    # --------------------------------------------------------

    if not user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )

    # --------------------------------------------------------
    # Check password
    # --------------------------------------------------------

    if not verify_password(
        credentials.password,
        user.password_hash,
    ):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )

    # --------------------------------------------------------
    # Create JWT
    # --------------------------------------------------------

    access_token = create_access_token(
        data={
            "sub": str(user.id)
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }


# ============================================================
# Google Login
# ============================================================

@router.get("/google")
async def google_login(
    request: Request,
):

    # --------------------------------------------------------
    # Check Google Client ID
    # --------------------------------------------------------

    if not GOOGLE_CLIENT_ID:

        raise HTTPException(
            status_code=500,
            detail="GOOGLE_CLIENT_ID is not configured.",
        )

    # --------------------------------------------------------
    # Check Google Client Secret
    # --------------------------------------------------------

    if not GOOGLE_CLIENT_SECRET:

        raise HTTPException(
            status_code=500,
            detail="GOOGLE_CLIENT_SECRET is not configured.",
        )

    try:

        # ----------------------------------------------------
        # Print configuration for debugging
        # ----------------------------------------------------

        print(
            "Google OAuth redirect URI:",
            GOOGLE_REDIRECT_URI,
        )

        # ----------------------------------------------------
        # Redirect user to Google
        # ----------------------------------------------------

        return await oauth.google.authorize_redirect(
            request,
            GOOGLE_REDIRECT_URI,
        )

    except Exception as exc:

        print(
            "Google OAuth initialization error:",
            repr(exc),
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to initialize Google Auth.",
        )


# ============================================================
# Google OAuth Callback
# ============================================================

@router.get("/google/callback")
async def google_callback(
    request: Request,
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Check Google configuration
    # --------------------------------------------------------

    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:

        return RedirectResponse(
            url=(
                f"{FRONTEND_URL}/login"
                "?error=google_not_configured"
            )
        )

    try:

        # ====================================================
        # Exchange authorization code for Google token
        # ====================================================

        token = await oauth.google.authorize_access_token(
            request
        )

        print(
            "Google OAuth token received successfully."
        )

        # ====================================================
        # Get Google user information
        # ====================================================

        user_info = token.get("userinfo")

        # ----------------------------------------------------
        # Try parsing OpenID Connect ID token
        # ----------------------------------------------------

        if not user_info:

            try:

                user_info = await oauth.google.parse_id_token(
                    request,
                    token,
                )

            except Exception as exc:

                print(
                    "ID token parsing failed:",
                    repr(exc),
                )

                user_info = None

        # ----------------------------------------------------
        # Fallback to Google's userinfo endpoint
        # ----------------------------------------------------

        if not user_info:

            response = await oauth.google.get(
                "https://openidconnect.googleapis.com/v1/userinfo",
                token=token,
            )

            user_info = response.json()

        # ====================================================
        # Validate Google user information
        # ====================================================

        if not user_info:

            raise Exception(
                "Unable to retrieve Google user information."
            )

        google_email = user_info.get("email")

        google_name = user_info.get(
            "name",
            "Google User",
        )

        # ----------------------------------------------------
        # Google must provide email
        # ----------------------------------------------------

        if not google_email:

            raise Exception(
                "Google account did not provide an email address."
            )

        google_email = google_email.lower()

        print(
            "Google account:",
            google_email,
        )

        # ====================================================
        # Find existing application user
        # ====================================================

        user = (
            db.query(User)
            .filter(
                User.email == google_email
            )
            .first()
        )

        # ====================================================
        # Create new user if necessary
        # ====================================================

        if not user:

            print(
                "Creating new Google user:",
                google_email,
            )

            user = User(
                name=google_name,
                email=google_email,

                # Google handles authentication.
                # Generate a random password to satisfy
                # the existing database model.
                password_hash=get_password_hash(
                    os.urandom(32).hex()
                ),

                role="student",
            )

            db.add(user)
            db.commit()
            db.refresh(user)

        else:

            print(
                "Existing user found:",
                google_email,
            )

        # ====================================================
        # Create Campus Lost & Found JWT
        # ====================================================

        access_token = create_access_token(
            data={
                "sub": str(user.id)
            }
        )

        # ====================================================
        # Redirect to React frontend
        # ====================================================

        callback_url = (
            f"{FRONTEND_URL}/oauth-callback"
            f"?token={access_token}"
        )

        print(
            "Redirecting to:",
            f"{FRONTEND_URL}/oauth-callback",
        )

        return RedirectResponse(
            url=callback_url
        )

    # ========================================================
    # Handle Google OAuth errors
    # ========================================================

    except Exception as exc:

        print(
            "Google OAuth error:",
            repr(exc),
        )

        return RedirectResponse(
            url=(
                f"{FRONTEND_URL}/login"
                "?error=google_auth_failed"
            )
        )


# ============================================================
# Current User
# ============================================================

@router.get(
    "/me",
    response_model=UserResponse,
)
def get_current_user_profile(
    current_user: User = Depends(
        get_current_user
    ),
):

    return current_user