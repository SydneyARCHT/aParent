import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings
from django.utils.deprecation import MiddlewareMixin
from .util import encode_token

SECRET_KEY = settings.SECRET_KEY

class TokenRefreshMiddleware(MiddlewareMixin):
    def process_request(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if auth_header:
            try:
                token = auth_header.split(' ')[1]
                payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
                exp = datetime.fromtimestamp(payload['exp'], timezone.utc)
                now = datetime.now(timezone.utc)
                if exp - now < timedelta(minutes=5):  # Refresh if less than 5 minutes to expiration
                    user_id = payload.get('sub')
                    role = payload.get('role')
                    new_token = encode_token(user_id, role)
                    request.META['HTTP_AUTHORIZATION'] = f'Bearer {new_token}'
            except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
                pass 