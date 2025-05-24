from django.contrib import admin
from .models import PaymentPlan, Installment

class InstallmentInline(admin.TabularInline):
    model = Installment
    extra = 0
    readonly_fields = ("amount", "due_date", "status", "paid_at", "created_at")
    can_delete = False

@admin.register(PaymentPlan)
class PaymentPlanAdmin(admin.ModelAdmin):
    list_display = (
        "id", "merchant", "customer", "total_amount", "num_installments",
        "status", "start_date", "created_at"
    )
    list_filter = ("status", "merchant", "customer", "start_date")
    search_fields = ("id", "merchant__username", "customer__username")
    inlines = [InstallmentInline]
    readonly_fields = ("created_at", "updated_at")

@admin.register(Installment)
class InstallmentAdmin(admin.ModelAdmin):
    list_display = ("id", "plan", "amount", "due_date", "status", "paid_at")
    list_filter = ("status", "due_date")
    search_fields = ("plan__id", "plan__customer__username")
    readonly_fields = ("created_at",)
