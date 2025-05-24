from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from rest_framework import status
from apps.plans.models import Installment


class MerchantDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request):
        if request.user.role != 'merchant':
            return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

        installments = Installment.objects.filter(plan__merchant=request.user)
        paid_qs = installments.filter(status='paid')
        total = installments.count()
        paid = paid_qs.count()
        overdue = installments.filter(status='late').count()
        revenue = sum(i.amount for i in paid_qs)

        success_rate = (paid / total) * 100 if total else 0.0

        return Response({
            "total_revenue": revenue,
            "overdue_installments": overdue,
            "success_rate": round(success_rate, 2),
        })
