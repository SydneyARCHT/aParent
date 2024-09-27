from datetime import datetime, timedelta, timezone
import jwt
from graphql import GraphQLError
from functools import wraps
from django.conf import settings
from django.contrib.auth import get_user_model
from .authentication import CustomTokenBackend

SECRET_KEY = settings.SECRET_KEY
User = get_user_model()

def encode_token(user_id, role, exp_minutes=15):
    payload = {
        'exp': datetime.now(timezone.utc) + timedelta(minutes=exp_minutes),
        'iat': datetime.now(timezone.utc),
        'sub': user_id,
        'role': role
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

def encode_refresh_token(user_id, role):
    payload = {
        'exp': datetime.now(timezone.utc) + timedelta(days=7),
        'iat': datetime.now(timezone.utc),
        'sub': user_id,
        'role': role
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

def token_required(func):
    @wraps(func)
    def wrapper(self, info, *args, **kwargs):
        auth = info.context.META.get('HTTP_AUTHORIZATION')
        if not auth:
            raise GraphQLError('Authorization header missing')

        try:
            token = auth.split(' ')[1]
            backend = CustomTokenBackend()
            user = backend.authenticate(request=info.context, token=token)
            if user is None:
                raise GraphQLError('Invalid token')
            info.context.user = user
        except jwt.ExpiredSignatureError:
            raise GraphQLError('Token has expired')
        except jwt.InvalidTokenError:
            raise GraphQLError('Invalid token')
        except User.DoesNotExist:
            raise GraphQLError('User not found')

        return func(self, info, *args, **kwargs)
    return wrapper