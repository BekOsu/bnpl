import os
import django
from django.contrib.auth import get_user_model

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bnpl_backend_project.settings")
django.setup()

User = get_user_model()

# Defaults are for development purposes only. Use environment variables in production.
username = os.environ.get("DJANGO_SUPERUSER_USERNAME", "admin")
email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "admin@gmail.com")
password = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "admin")

if not username or not email or not password:
    raise ValueError("Superuser environment variables must not be empty.")

if not User.objects.filter(username=username).exists():
    print(f"Creating superuser '{username}'...")
    User.objects.create_superuser(username=username, email=email, password=password)
else:
    print(f"Superuser '{username}' already exists.")