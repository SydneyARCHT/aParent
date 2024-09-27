from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model
from django.conf import settings
import jwt

User = get_user_model()
SECRET_KEY = settings.SECRET_KEY

class CustomTokenBackend(BaseBackend):
    def authenticate(self, request, token=None):
        if token is None:
            return None

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('sub')
            if user_id is None:
                return None
            user = User.objects.get(id=user_id)
            return user
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, User.DoesNotExist):
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None