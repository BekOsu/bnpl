from django.urls import path
from .views import MerchantDashboardView

urlpatterns = [
    path('merchant/', MerchantDashboardView.as_view(), name='merchant-dashboard'),
]
