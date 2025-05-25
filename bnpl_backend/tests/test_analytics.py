import pytest
from django.urls import reverse

@pytest.mark.django_db
def test_merchant_dashboard_access(merchant_client):
    url = reverse("merchant-dashboard")
    res = merchant_client.get(url)
    assert res.status_code == 200
    assert "total_revenue" in res.json()

@pytest.mark.django_db
def test_customer_dashboard_forbidden(customer_client):
    url = reverse("merchant-dashboard")
    res = customer_client.get(url)
    assert res.status_code == 403
