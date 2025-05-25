from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import PaymentPlan, Installment
from .serializers import (
    PaymentPlanSerializer,
    InstallmentSerializer,
    InstallmentPaySerializer,
)


class IsMerchant(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'merchant'


class IsPlanParticipant(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user == obj.merchant or request.user == obj.customer


class PaymentPlanViewSet(viewsets.ModelViewSet):
    queryset = PaymentPlan.objects.all()
    serializer_class = PaymentPlanSerializer

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, IsMerchant]
        elif self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsPlanParticipant]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [perm() for perm in permission_classes]

    def get_queryset(self):
        # Allow Swagger and unauthenticated access to pass safely
        if getattr(self, "swagger_fake_view", False):
            return PaymentPlan.objects.none()
        user = self.request.user
        if not user.is_authenticated:
            return PaymentPlan.objects.none()
        if user.role == 'merchant':
            return PaymentPlan.objects.filter(merchant=user)
        elif user.role == 'customer':
            return PaymentPlan.objects.filter(customer=user)
        return PaymentPlan.objects.none()

    def perform_create(self, serializer):
        serializer.save()


class InstallmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Installment.objects.all()
    serializer_class = InstallmentSerializer

    def get_queryset(self):
        # Allow Swagger and unauthenticated access to pass safely
        if getattr(self, "swagger_fake_view", False):
            return Installment.objects.none()
        user = self.request.user
        if not user.is_authenticated:
            return Installment.objects.none()
        if user.role == 'merchant':
            return Installment.objects.filter(plan__merchant=user)
        elif user.role == 'customer':
            return Installment.objects.filter(plan__customer=user)
        return Installment.objects.none()

    @action(detail=True, methods=['post'], url_path='pay', permission_classes=[permissions.IsAuthenticated])
    def pay(self, request, pk=None):
        installment = self.get_object()
        if request.user != installment.plan.customer:
            return Response({"detail": "Not your installment."}, status=status.HTTP_403_FORBIDDEN)
        serializer = InstallmentPaySerializer(installment, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(InstallmentSerializer(installment).data, status=status.HTTP_200_OK)
