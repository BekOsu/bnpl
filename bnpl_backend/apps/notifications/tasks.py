import logging
from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from apps.plans.models import Installment

logger = logging.getLogger(__name__)


@shared_task
def auto_mark_late_installments():
    target = timezone.now().date()
    qs = Installment.objects.filter(status='pending', due_date__lt=target)
    for inst in qs:
        inst.mark_late()
        logger.info(f"[Auto-Mark Late] Installment {inst.id} marked as late.")


@shared_task
def send_due_soon_reminders():
    target = timezone.now().date() + timedelta(days=3)
    qs = Installment.objects.filter(status='pending', due_date=target)
    for inst in qs:
        # In real life, send an email; here we just log to console
        logger.info(f"[Reminder] Installment {inst.id} for {inst.plan.customer.email} due {inst.due_date}")


@shared_task
def send_overdue_reminders():
    target = timezone.now().date()
    qs = Installment.objects.filter(status='pending', due_date__lt=target)
    for inst in qs:
        logger.info(f"[Overdue] Installment {inst.id} for {inst.plan.customer.email} overdue since {inst.due_date}")
        inst.mark_late()
        logger.info(f"[Update] Installment {inst.id} marked as late.")
