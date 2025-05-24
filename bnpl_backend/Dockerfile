FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /code

COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

# Copy .env file into image
COPY env.prod .env

# Export environment variables before running collectstatic
RUN export $(cat .env | xargs) && mkdir -p /code/staticfiles && python manage.py collectstatic --noinput

CMD ["gunicorn", "bnpl_backend_project.wsgi:application", "--bind", "0.0.0.0:8000"]
