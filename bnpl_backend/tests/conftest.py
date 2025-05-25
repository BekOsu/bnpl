import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django.urls import reverse

User = get_user_model()

@pytest.fixture
def merchant(db):
    return User.objects.create_user(username="merchant2", email="merchant2@test.com", password="Abcd1234!", role="merchant")

@pytest.fixture
def customer(db):
    return User.objects.create_user(username="user2", email="user2@test.com", password="User7890#", role="customer")

@pytest.fixture
def merchant_client(merchant):
    client = APIClient()
    resp = client.post(reverse("token_obtain_pair"), {"username": merchant.username, "password": "Abcd1234!"})
    token = resp.data["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    return client

@pytest.fixture
def customer_client(customer):
    client = APIClient()
    resp = client.post(reverse("token_obtain_pair"), {"username": customer.username, "password": "User7890#"})
    token = resp.data["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    return client

@pytest.fixture
def client():
    return APIClient()
