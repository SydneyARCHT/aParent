"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt
from graphql_playground.views import GraphQLPlaygroundView
from api.schema import schema
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),  # Assuming your app is named 'api'
    path('', RedirectView.as_view(url='/api/', permanent=True)),
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True, schema=schema))),
    path('playground/', GraphQLPlaygroundView.as_view(endpoint="/graphql/")),  # GraphQL Playground
]