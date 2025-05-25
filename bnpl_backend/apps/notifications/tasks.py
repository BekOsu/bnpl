import logging
from celery import shared_task
from django.core.mail import send_mail
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
        subject = "Installment Due Soon"
        message = f"Dear {inst.plan.customer.username}, your installment of {inst.amount} is due on {inst.due_date}."
        recipient = [inst.plan.customer.email]
        send_mail(subject, message, "no-reply@bnpl.com", recipient)
        logger.info(f"[Reminder Sent] to {recipient[0]} for Installment {inst.id}")


@shared_task
def send_overdue_reminders():
    target = timezone.now().date()
    qs = Installment.objects.filter(status='pending', due_date__lt=target)
    for inst in qs:
        subject = "Installment Overdue"
        message = f"Dear {inst.plan.customer.username}, your installment of {inst.amount} was due on {inst.due_date}."
        recipient = [inst.plan.customer.email]
        send_mail(subject, message, "no-reply@bnpl.com", recipient)
        inst.mark_late()
        logger.info(f"[Overdue Email Sent] to {recipient[0]} | Installment {inst.id} marked late.")

