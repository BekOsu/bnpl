import datetime
from django.utils import timezone
import pytest
from django.urls import reverse
from apps.plans.models import Installment

@pytest.mark.django_db
def test_merchant_can_create_plan(merchant_client, customer):
    url = reverse("plans-list")
    data = {
        "customer_email": customer.email,
        "total_amount": "1000.00",
        "num_installments": 4,
        "start_date": "2025-06-01",
    }
    res = merchant_client.post(url, data)
    assert res.status_code == 201
    assert res.data["customer"] == customer.id
    assert len(res.data["installments"]) == 4

@pytest.mark.django_db
def test_customer_can_pay_due_installment(merchant_client, customer_client, customer):
    # Create plan
    url = reverse("plans-list")
    data = {
        "customer_email": customer.email,
        "total_amount": "800.00",
        "num_installments": 2,
        "start_date": "2024-01-01",
    }
    res = merchant_client.post(url, data)
    assert res.status_code == 201
    inst_id = res.data["installments"][0]["id"]

    # Simulate past due date
    installment = Installment.objects.get(id=inst_id)
    installment.due_date = timezone.now().date() - datetime.timedelta(days=1)
    installment.save()

    # Pay
    pay_url = reverse("installments-pay", args=[inst_id])
    res = customer_client.post(pay_url)
    assert res.status_code == 200
    assert res.data["status"] == "paid"
