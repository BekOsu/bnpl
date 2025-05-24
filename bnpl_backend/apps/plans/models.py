from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

User = get_user_model()


class PaymentPlan(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('overdue', 'Overdue'),
        ('cancelled', 'Cancelled'),
    ]

    merchant = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="merchant_plans",
        limit_choices_to={'role': 'merchant'}
    )
    customer = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="customer_plans",
        limit_choices_to={'role': 'customer'}
    )
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    num_installments = models.PositiveIntegerField()
    start_date = models.DateField()
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        # Ensure a merchant and a customer are different users
        if self.merchant == self.customer:
            raise ValidationError("Merchant and customer must be different users.")
        if self.total_amount <= 0:
            raise ValidationError("Total amount must be positive.")
        if self.num_installments < 1:
            raise ValidationError("At least one installment required.")

    def __str__(self):
        return f"BNPL Plan {self.id} | {self.customer} | {self.total_amount}"


class Installment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('late', 'Late'),
    ]

    plan = models.ForeignKey(PaymentPlan, on_delete=models.CASCADE, related_name="installments")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    due_date = models.DateField()
    status = models.CharField(max_length=8, choices=STATUS_CHOICES, default='pending')
    paid_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['due_date']

    def clean(self):
        if self.amount <= 0:
            raise ValidationError("Installment amount must be positive.")
        if self.due_date < self.plan.start_date:
            raise ValidationError("Installment due date must be on or after the plan start date.")

    def mark_paid(self):
        self.status = 'paid'
        self.paid_at = timezone.now()
        self.save()

    def mark_late(self):
        self.status = 'late'
        self.save()

    def __str__(self):
        return f"Installment {self.id} | {self.amount} | {self.status}"
