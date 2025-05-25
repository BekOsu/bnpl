from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import PaymentPlanViewSet, InstallmentViewSet

router = DefaultRouter()
router.register(r'', PaymentPlanViewSet, basename='plans')
router.register(r'installments', InstallmentViewSet, basename='installments')

urlpatterns = [
    path('', include(router.urls)),
]
