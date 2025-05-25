from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Installment

@receiver(post_save, sender=Installment)
def update_plan_status(sender, instance, **kwargs):
    plan = instance.plan
    if plan.installments.filter(status='paid').count() == plan.num_installments:
        plan.status = 'completed'
        plan.save()