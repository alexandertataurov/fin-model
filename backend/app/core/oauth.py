from authlib.integrations.starlette_client import OAuth
from app.core.config import settings

# Initialize OAuth
oauth = OAuth()

# Google OAuth configuration
google = oauth.register(
    name='google',
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url=(
        'https://accounts.google.com/.well-known/openid_configuration'
    ),
    client_kwargs={
        'scope': 'openid email profile'
    }
)

# Microsoft OAuth configuration
microsoft = oauth.register(
    name='microsoft',
    client_id=settings.MICROSOFT_CLIENT_ID,
    client_secret=settings.MICROSOFT_CLIENT_SECRET,
    server_metadata_url=(
        'https://login.microsoftonline.com/common/v2.0/.well-known/'
        'openid_configuration'
    ),
    client_kwargs={
        'scope': 'openid email profile'
    }
)


def get_oauth_client(provider: str):
    """Get OAuth client by provider name."""
    if provider == 'google':
        return google
    elif provider == 'microsoft':
        return microsoft
    else:
        raise ValueError(f"Unsupported OAuth provider: {provider}")