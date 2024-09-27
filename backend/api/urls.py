from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from .schema import schema
from .views import index, LoginView, CustomGraphQLView

urlpatterns = [
    path('', index, name='index'),
    path('graphql/', csrf_exempt(CustomGraphQLView.as_view(graphiql=True, schema=schema))),
    path('login/', LoginView.as_view(), name='login'),
]