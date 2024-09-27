
import logging
from graphene_django.views import GraphQLView
from django.http import JsonResponse

logger = logging.getLogger(__name__)

class CustomGraphQLView(GraphQLView):
    def execute_graphql_request(self, *args, **kwargs):
        try:
            return super().execute_graphql_request(*args, **kwargs)
        except Exception as e:
            logger.error(f"GraphQL execution error: {e}")
            return JsonResponse({'errors': str(e)}, status=500)


from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json

def index(request):
    return HttpResponse("Welcome to the API")

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(View):
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'success': True, 'message': 'Login successful'})
        else:
            return JsonResponse({'success': False, 'message': 'Invalid credentials'}, status=400)