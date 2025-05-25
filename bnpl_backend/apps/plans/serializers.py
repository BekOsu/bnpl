from decimal import ROUND_HALF_UP, Decimal
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers
from dateutil.relativedelta import relativedelta

from django.contrib.auth import get_user_model
from .models import Installment, PaymentPlan

User = get_user_model()


class InstallmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Installment
        fields = ["id", "amount", "due_date", "status", "paid_at"]
        read_only_fields = ["status", "paid_at"]

    def update(self, instance, validated_data):
        if instance.status == 'paid':
            raise serializers.ValidationError("Paid installments cannot be edited.")
        return super().update(instance, validated_data)


class PaymentPlanSerializer(serializers.ModelSerializer):
    installments = InstallmentSerializer(many=True, read_only=True)
    merchant = serializers.HiddenField(default=serializers.CurrentUserDefault())
    customer_email = serializers.EmailField(write_only=True)

    class Meta:
        model = PaymentPlan
        fields = [
            "id", "merchant", "customer", "customer_email",
            "total_amount", "num_installments", "start_date",
            "status", "created_at", "updated_at", "installments",
        ]
        read_only_fields = [
            "status", "created_at", "updated_at", "installments", "customer"
        ]

    def validate(self, data):
        user = self.context["request"].user
        if user.role != "merchant":
            raise serializers.ValidationError("Only merchants can create plans.")
        if data["total_amount"] <= 0:
            raise serializers.ValidationError("Total amount must be positive.")
        if data["num_installments"] < 1:
            raise serializers.ValidationError("At least one installment required.")
        return data

    def create(self, validated_data):
        customer_email = validated_data.pop("customer_email")
        try:
            customer = User.objects.get(email=customer_email, role="customer")
        except User.DoesNotExist:
            raise serializers.ValidationError({
                "customer_email": "No customer with that email."
            })

        merchant = validated_data.pop("merchant")

        total = Decimal(validated_data["total_amount"])
        n = validated_data["num_installments"]
        start_date = validated_data["start_date"]

        base = (total / n).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        amounts = [base] * n
        amounts[-1] = total - base * (n - 1)

        with transaction.atomic():
            plan = PaymentPlan.objects.create(
                merchant=merchant,
                customer=customer,
                **validated_data
            )
            for i in range(n):
                due = start_date + relativedelta(months=i)
                Installment.objects.create(plan=plan, amount=amounts[i], due_date=due)

        return plan


class InstallmentPaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Installment
        fields = ["id"]

    def validate(self, attrs):
        inst = self.instance
        if inst.status == "paid":
            raise serializers.ValidationError("Already paid.")
        if inst.due_date > timezone.now().date():
            raise serializers.ValidationError("Too early to pay.")
        return attrs

    def save(self, **kwargs):
        self.instance.mark_paid()
        return self.instance
