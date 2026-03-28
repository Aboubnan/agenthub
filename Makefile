.PHONY: help up down build logs shell-backend shell-db test lint format

help:
	@echo "AgentHub - Available commands:"
	@echo "  make up          - Start all services"
	@echo "  make down        - Stop all services"
	@echo "  make build       - Rebuild containers"
	@echo "  make logs        - Follow logs"
	@echo "  make shell-backend - Open shell in backend container"
	@echo "  make shell-db    - Open psql in db container"
	@echo "  make test        - Run backend tests"
	@echo "  make lint        - Run linters"
	@echo "  make format      - Format code"

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose up -d --build

logs:
	docker compose logs -f

shell-backend:
	docker compose exec backend bash

shell-db:
	docker compose exec db psql -U agenthub -d agenthub

test:
	docker compose exec backend pytest tests/ -v

lint:
	docker compose exec backend flake8 app/
	docker compose exec backend mypy app/

format:
	docker compose exec backend black app/
	docker compose exec backend isort app/
