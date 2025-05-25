from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import PaymentPlanViewSet, InstallmentViewSet

router = DefaultRouter()
router.register(r'installments', InstallmentViewSet, basename='installments')
router.register(r'', PaymentPlanViewSet, basename='plans')

urlpatterns = [
    path('', include(router.urls)),
]
