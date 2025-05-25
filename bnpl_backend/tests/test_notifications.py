import pytest
from django.utils import timezone
from apps.plans.models import Installment, PaymentPlan
from django.contrib.auth import get_user_model
from apps.notifications.tasks import send_due_soon_reminders

User = get_user_model()

@pytest.mark.django_db
def test_due_soon_reminders_logged(caplog):
    merchant = User.objects.create_user(username="m", email="m@m.com", password="x", role="merchant")
    customer = User.objects.create_user(username="c", email="c@c.com", password="x", role="customer")
    plan = PaymentPlan.objects.create(merchant=merchant, customer=customer, total_amount=300, num_installments=1, start_date=timezone.now())

    Installment.objects.create(plan=plan, amount=300, due_date=timezone.now().date() + timezone.timedelta(days=3))

    with caplog.at_level("INFO"):
        send_due_soon_reminders()

    assert "[Reminder Sent]" in caplog.text
