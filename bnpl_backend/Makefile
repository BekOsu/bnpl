.PHONY: help install migrate run test

help:
	@echo "Available targets:"
	@echo "  install   Install Python deps"
	@echo "  migrate   Apply Django migrations"
	@echo "  run       Run via docker-compose"
	@echo "  test      Run pytest"

install:
	pip install -r requirements.txt

migrate:
	python manage.py migrate

run:
	docker-compose up --build

test:
	pytest --maxfail=1 --disable-warnings -q
