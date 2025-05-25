import pytest
from django.urls import reverse


@pytest.mark.django_db
def test_user_registration_and_login(client):
    reg_url = reverse("register")

    # Register merchant
    merchant_data = {
        "username": "merchant1",
        "email": "merchant1@test.com",
        "password": "TestPass123!",
        "password2": "TestPass123!",
        "role": "merchant"
    }
    res = client.post(reg_url, merchant_data)
    assert res.status_code == 201
    assert res.json()["email"] == "merchant1@test.com"

    # Register customer
    customer_data = {
        "username": "customer1",
        "email": "customer1@test.com",
        "password": "UserPass456@",
        "password2": "UserPass456@",
        "role": "customer"
    }
    res = client.post(reg_url, customer_data)
    assert res.status_code == 201

    # Login customer
    token_url = reverse("token_obtain_pair")
    res = client.post(token_url, {
        "username": "customer1",
        "password": "UserPass456@"
    })
    assert res.status_code == 200
    access_token = res.data["access"]

    # Get profile
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
    res = client.get(reverse("me"))
    assert res.status_code == 200
    assert res.data["role"] == "customer"
